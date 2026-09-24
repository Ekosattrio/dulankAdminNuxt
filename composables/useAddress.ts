import type { AddressResponse, CustomerAddress, SupplierAddress, AddressFilterParams, AddressFormData } from '#server/types/address'

export function useAddress(filterParams?: Ref<AddressFilterParams> | AddressFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<AddressResponse>('/api/address', {
    key: 'address-list',
    query: params
  })

  const stats = computed(() => data.value?.stats)
  const customers = computed<CustomerAddress[]>(() => data.value?.customers ?? [])
  const suppliers = computed<SupplierAddress[]>(() => data.value?.suppliers ?? [])

  const saveAddress = async (payload: AddressFormData) => {
    const res = await $fetch<{ success: boolean; data: any; message?: string }>('/api/address', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteAddress = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/address/${id}`, {
      method: 'DELETE'
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
