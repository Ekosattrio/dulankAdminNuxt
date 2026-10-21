import type { Supplier, SupplierFormData } from '#server/types/supplier'

interface ResponseData {
  success: boolean
  data: Supplier[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: Supplier
  message?: string
}

/**
 * Supplier (purchases) — backend Laravel `/api/v1/admin/suppliers`.
 * Route backend memakai kode supplier (`{supplierId}`); terima `id`
 * maupun `supplierId` dan resolusi dari list.
 */
export function useSuppliers() {
  const query = { limit: 100 }

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/suppliers', {
    key: 'suppliers-list',
    query
  })

  const suppliers = computed<Supplier[]>(() => data.value?.data ?? [])

  const resolveSupplierId = (idOrCode: string): string => {
    return suppliers.value.find(supplier => supplier.id === idOrCode || supplier.supplierId === idOrCode)?.supplierId
      ?? idOrCode
  }

  const saveSupplier = async (payload: SupplierFormData) => {
    const { id, ...body } = payload
    if (!id && (!body.supplierId || /^auto[\s-]*generated$/i.test(body.supplierId))) delete body.supplierId
    const { persistImage } = useImageUpload()
    if (body.photo !== undefined) body.photo = await persistImage(body.photo, 'suppliers')

    const res = await apiFetch<MutationResponse>(
      id
        ? `/api/v1/admin/suppliers/${encodeURIComponent(resolveSupplierId(id))}`
        : '/api/v1/admin/suppliers',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteSupplier = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/suppliers/${encodeURIComponent(resolveSupplierId(id))}`,
      { method: 'DELETE' }
    )

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