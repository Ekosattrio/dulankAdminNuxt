import type { CustomerType, CustomerTypeFormData, CustomerTypeFilterParams } from '#server/types/customer-type'

interface ResponseData {
  success: boolean
  data: CustomerType[]
  message?: string
}

export function useCustomerTypes(filterParams?: Ref<CustomerTypeFilterParams> | CustomerTypeFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/customer-types', {
    key: 'customer-types-list',
    query: params
  })

  const customerTypes = computed<CustomerType[]>(() => data.value?.data ?? [])

  const saveCustomerType = async (payload: CustomerTypeFormData) => {
    const res = await $fetch<{ success: boolean; data: CustomerType; message?: string }>('/api/customer-types', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteCustomerType = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/customer-types/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    customerTypes,
    pending,
    error,
    refresh,
    saveCustomerType,
    deleteCustomerType
  }
}
