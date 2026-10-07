import type { AddressResponse, CustomerAddress, SupplierAddress, AddressFormData } from '#server/types/address'

export function useAddress() {
  const { data, pending, error, refresh } = useFetch<AddressResponse>('/api/address', {
    key: 'address-list'
  })

  const stats = computed(() => data.value?.stats)
  const customers = computed<CustomerAddress[]>(() => data.value?.customers ?? [])
  const suppliers = computed<SupplierAddress[]>(() => data.value?.suppliers ?? [])

  const saveAddress = async (payload: AddressFormData | any, type?: 'customer' | 'supplier') => {
    const res = await $fetch<{ success: boolean; data: any; message?: string }>('/api/address', {
      method: 'POST',
      body: { ...payload, ...(type ? { type } : {}) }
    })
    await refresh()
    return res
  }

  const deleteAddress = async (id: string, type?: 'customer' | 'supplier') => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/address/${id}`, {
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
