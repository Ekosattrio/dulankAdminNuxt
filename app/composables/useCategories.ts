import type { Category, CategoryFormData, CategoryFilterParams } from '#server/types/category'

interface ResponseData {
  success: boolean
  data: Category[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: Category
  message?: string
}

/**
 * Kategori produk — backend Laravel `/api/v1/admin/categories`.
 */
export function useCategories(filterParams?: Ref<CategoryFilterParams> | CategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/categories', {
    key: 'categories-list',
    query
  })

  const categories = computed<Category[]>(() => data.value?.data ?? [])

  const saveCategory = async (payload: CategoryFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/categories/${encodeURIComponent(id)}` : '/api/v1/admin/categories',
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
      `/api/v1/admin/categories/${encodeURIComponent(id)}`,
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