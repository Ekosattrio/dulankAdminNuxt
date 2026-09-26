import type { Customer, CustomerFormData, CustomerFilterParams } from '#server/types/customer'

interface ResponseData {
  success: boolean
  data: Customer[]
  message?: string
}

export function useCustomers(filterParams?: Ref<CustomerFilterParams> | CustomerFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/customers', {
    key: 'customers-list',
    query: params
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
