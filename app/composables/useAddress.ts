import type { AddressResponse, CustomerAddress, SupplierAddress, AddressFormData } from '#server/types/address'
import { apiFetch } from '~/utils/apiFetch'

export function useAddress() {
  const endpoint: string = '/api/address'
  const { data, pending, error, refresh } = useAsyncData(
    'address-list',
    () => apiFetch<AddressResponse>(endpoint),
  )

  const stats = computed(() => data.value?.stats)
  const customers = computed<CustomerAddress[]>(() => data.value?.customers ?? [])
  const suppliers = computed<SupplierAddress[]>(() => data.value?.suppliers ?? [])

  const saveAddress = async (payload: AddressFormData, type?: 'customer' | 'supplier') => {
    const res = await apiFetch<{ success: boolean; data: CustomerAddress | SupplierAddress; message?: string }>('/api/address', {
      method: 'POST',
      body: { ...payload, ...(type ? { type } : {}) }
    })
    await refresh()
    return res
  }

  const deleteAddress = async (id: string, type?: 'customer' | 'supplier') => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/address/${id}`, {
      method: 'DELETE',
      params: type ? { type } : undefined
    })
    await refresh()
    return res
  }

  return {
    stats,
    customers,
    suppliers,
    pending,
    error,
    refresh,
    saveAddress,
    deleteAddress
  }
}
