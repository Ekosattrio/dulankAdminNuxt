import type { Customer, CustomerFormData } from '#server/types/customer'

interface ResponseData {
  success: boolean
  data: Customer[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: Customer
  message?: string
}

/**
 * Pelanggan (Peoples) — backend Laravel `/api/v1/admin/customers`.
 * Kontrak resource identik dengan tipe admin (`Customer`).
 */
export function useCustomers() {
  const query = { limit: 100 }

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/customers', {
    key: 'customers-list',
    query
  })

  const customers = computed<Customer[]>(() => data.value?.data ?? [])

  const saveCustomer = async (payload: CustomerFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/customers/${encodeURIComponent(id)}` : '/api/v1/admin/customers',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteCustomer = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/customers/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

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