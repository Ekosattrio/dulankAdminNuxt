import type { CustomerType, CustomerTypeFormData } from '#server/types/customer-type'

interface ResponseData {
  success: boolean
  data: CustomerType[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: CustomerType
  message?: string
}

/**
 * Tipe pelanggan — backend Laravel `/api/v1/admin/customer-types`.
 */
export function useCustomerTypes() {
  const query = { limit: 100 }

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/customer-types', {
    key: 'customer-types-list',
    query
  })

  const customerTypes = computed<CustomerType[]>(() => data.value?.data ?? [])

  const saveCustomerType = async (payload: CustomerTypeFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/customer-types/${encodeURIComponent(id)}` : '/api/v1/admin/customer-types',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteCustomerType = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/customer-types/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

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