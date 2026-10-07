import type { Customer, CustomerFormData } from '#server/types/customer'

interface ResponseData {
  success: boolean
  data: Customer[]
  message?: string
}

export function useCustomers() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/customers', {
    key: 'customers-list'
  })

  const customers = computed<Customer[]>(() => data.value?.data ?? [])

  const saveCustomer = async (payload: CustomerFormData) => {
    const res = await $fetch<{ success: boolean; data: Customer; message?: string }>('/api/customers', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteCustomer = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/customers/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    customers,
    pending,
    error,
    refresh,
    saveCustomer,
    deleteCustomer
  }
}
