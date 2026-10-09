import type { Supplier, SupplierFormData } from '#server/types/supplier'

interface ResponseData {
  success: boolean
  data: Supplier[]
  message?: string
}

export function useSuppliers() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/suppliers', {
    key: 'suppliers-list'
  })

  const suppliers = computed<Supplier[]>(() => data.value?.data ?? [])

  const saveSupplier = async (payload: SupplierFormData) => {
    const res = await apiFetch<{ success: boolean; data: Supplier; message?: string }>('/api/suppliers', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteSupplier = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/suppliers/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    suppliers,
    pending,
    error,
    refresh,
    saveSupplier,
    deleteSupplier
  }
}
