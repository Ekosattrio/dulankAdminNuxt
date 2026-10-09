import type { CustomerType, CustomerTypeFormData } from '#server/types/customer-type'

interface ResponseData {
  success: boolean
  data: CustomerType[]
  message?: string
}

export function useCustomerTypes() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/customer-types', {
    key: 'customer-types-list'
  })

  const customerTypes = computed<CustomerType[]>(() => data.value?.data ?? [])

  const saveCustomerType = async (payload: CustomerTypeFormData) => {
    const res = await apiFetch<{ success: boolean; data: CustomerType; message?: string }>('/api/customer-types', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteCustomerType = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/customer-types/${id}`, {
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
