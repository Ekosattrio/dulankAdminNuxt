import type { BlogCategory, BlogCategoryFormData } from '#server/types/blog'

interface ResponseData {
  success: boolean
  data: BlogCategory[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: BlogCategory
  message?: string
}

/**
 * Kategori blog — backend Laravel `/api/v1/admin/blog-categories`.
 */
export function useBlogCategories() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/blog-categories', {
    key: 'blog-categories-list',
    query: { limit: 100 }
  })

  const categories = computed<BlogCategory[]>(() => data.value?.data ?? [])

  const saveCategory = async (payload: BlogCategoryFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/blog-categories/${encodeURIComponent(id)}` : '/api/v1/admin/blog-categories',
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
      `/api/v1/admin/blog-categories/${encodeURIComponent(id)}`,
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