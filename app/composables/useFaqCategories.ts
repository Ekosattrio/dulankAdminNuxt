import type { FaqCategory, FaqCategoryFormData } from '#server/types/faq'

interface ResponseData {
  success: boolean
  data: FaqCategory[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: FaqCategory
  message?: string
}

/**
 * Kategori FAQ — backend Laravel `/api/v1/admin/faq-categories`.
 * Backend hanya menyediakan buat + hapus (tanpa ubah).
 */
export function useFaqCategories() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/faq-categories', {
    key: 'faq-categories-list',
    query: { limit: 100 }
  })

  const categories = computed<FaqCategory[]>(() => data.value?.data ?? [])

  const saveCategory = async (payload: FaqCategoryFormData) => {
    const { id, ...body } = payload
    void id

    const res = await apiFetch<MutationResponse>('/api/v1/admin/faq-categories', {
      method: 'POST',
      body
    })

    await refresh()
    return res
  }

  const deleteCategory = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/faq-categories/${encodeURIComponent(id)}`,
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