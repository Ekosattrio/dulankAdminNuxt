import type { PurchaseCategory, PurchaseCategoryFormData, PurchaseCategoryFilterParams } from '#server/types/purchase-category'

interface ResponseData {
  success: boolean
  data: PurchaseCategory[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: PurchaseCategory
  message?: string
}

/**
 * Kategori pembelian — backend Laravel `/api/v1/admin/purchase-categories`.
 */
export function usePurchaseCategories(filterParams?: Ref<PurchaseCategoryFilterParams> | PurchaseCategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/purchase-categories', {
    key: 'purchase-categories-list',
    query
  })

  const categories = computed<PurchaseCategory[]>(() => data.value?.data ?? [])

  const saveCategory = async (payload: PurchaseCategoryFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/purchase-categories/${encodeURIComponent(id)}` : '/api/v1/admin/purchase-categories',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteCategory = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/purchase-categories/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  return {
    categories,
    pending,
    error,
    refresh,
    saveCategory,
    deleteCategory
  }
}