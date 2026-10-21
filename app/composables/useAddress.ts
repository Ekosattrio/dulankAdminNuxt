import type { AddressResponse, AddressStats, CustomerAddress, SupplierAddress, AddressFormData } from '#server/types/address'

const CUSTOMER_LIST_KEY = 'address-customers'
const SUPPLIER_LIST_KEY = 'address-suppliers'
const STATS_KEY = 'address-stats'

interface ListResponse<T> {
  success: boolean
  data: T[]
  meta?: { page: number; limit: number; total: number }
}

interface StatsResponse {
  success: boolean
  data: AddressStats
}

interface MutationResponse {
  success: boolean
  data?: CustomerAddress | SupplierAddress
  message?: string
}

/**
 * Alamat pelanggan & supplier (Peoples) — backend Laravel
 * `/api/v1/admin/addresses` (+ `/addresses/stats`).
 *
 * Backend memisahkan daftar via query `type`, sehingga komposabel ini
 * menggabungkan tiga panggilan (stats, customer, supplier) agar tetap
 * mengekspos API `{ stats, customers, suppliers }` yang dipakai halaman.
 */
export function useAddress() {
  const { provinces, regencies, districts } = useLocationOptions()
  const { data: statsData, pending: statsPending, error: statsError, refresh: refreshStats } = useApiFetch<StatsResponse>(`/api/v1/admin/addresses/stats`, {
    key: STATS_KEY
  })

  const { data: customersData, pending: customersPending, error: customersError, refresh: refreshCustomers } = useApiFetch<ListResponse<CustomerAddress>>(
    '/api/v1/admin/addresses',
    {
      key: CUSTOMER_LIST_KEY,
      query: { type: 'customer', limit: 100 }
    }
  )

  const { data: suppliersData, pending: suppliersPending, error: suppliersError, refresh: refreshSuppliers } = useApiFetch<ListResponse<SupplierAddress>>(
    '/api/v1/admin/addresses',
    {
      key: SUPPLIER_LIST_KEY,
      query: { type: 'supplier', limit: 100 }
    }
  )

  const stats = computed(() => statsData.value?.data)
  const customers = computed<CustomerAddress[]>(() => customersData.value?.data ?? [])
  const suppliers = computed<SupplierAddress[]>(() => suppliersData.value?.data ?? [])
  const totalCustomers = computed(() => customersData.value?.meta?.total ?? 0)
  const totalSuppliers = computed(() => suppliersData.value?.meta?.total ?? 0)
  const pending = computed(() => statsPending.value || customersPending.value || suppliersPending.value)
  const error = computed(() => statsError.value || customersError.value || suppliersError.value)

  const refresh = async () => {
    await Promise.all([refreshStats(), refreshCustomers(), refreshSuppliers()])
  }

  const saveAddress = async (payload: AddressFormData, kind?: 'customer' | 'supplier') => {
    const { id, customerId, type, ...rest } = payload
    const ownerType = kind ?? type ?? 'customer'
    if (!customerId || !/^\d+$/.test(String(customerId))) throw new Error('Pilih ID pemilik alamat dari data pelanggan atau supplier.')

    const province = provinces.value.find(item => item.name === rest.province)
    const regency = regencies.value.find(item => item.name === rest.city && (!province || item.provinceId === province.id))
    const district = districts.value.find(item => item.name === rest.district && (!regency || item.regencyId === regency.id))
    const body = {
      provinceId: province?.id, regencyId: regency?.id, districtId: district?.id,
      ownerType,
      ownerId: Number(customerId || 0),
      name: rest.name,
      contact: rest.contact,
      province: rest.province,
      city: rest.city,
      district: rest.district,
      detailAddress: rest.detailAddress,
      otherDetail: rest.otherDetail,
      status: rest.status
    }

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/addresses/${encodeURIComponent(id)}` : '/api/v1/admin/addresses',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteAddress = async (id: string, _kind?: 'customer' | 'supplier') => {
    void _kind

    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/addresses/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  return {
    stats,
    customers,
    suppliers,
    totalCustomers,
    totalSuppliers,
    pending,
    error,
    refresh,
    saveAddress,
    deleteAddress
  }
}
