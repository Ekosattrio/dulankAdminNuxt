import type { PurchaseCategory, PurchaseCategoryFormData, PurchaseCategoryFilterParams } from '#server/types/purchase-category'

interface ResponseData {
  success: boolean
  data: PurchaseCategory[]
  meta?: { total: number }
  message?: string
}

export function usePurchaseCategories(filterParams?: Ref<PurchaseCategoryFilterParams> | PurchaseCategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/purchase-categories', {
    key: 'purchase-categories-list',
    query: params
  })

  const categories = computed<PurchaseCategory[]>(() => data.value?.data ?? [])

  const saveCategory = async (payload: PurchaseCategoryFormData) => {
    const res = await apiFetch<{ success: boolean; data: PurchaseCategory; message?: string }>('/api/purchase-categories', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteCategory = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/purchase-categories/${id}`, {
      method: 'DELETE'
    })
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
