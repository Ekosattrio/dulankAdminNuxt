import type { FaqCategory, FaqCategoryFormData } from '#server/types/faq'

interface ResponseData {
  success: boolean
  data: FaqCategory[]
  message?: string
}

export function useFaqCategories() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/faq-categories', {
    key: 'faq-categories-list'
  })

  const categories = computed<FaqCategory[]>(() => data.value?.data ?? [])

  const saveCategory = async (payload: FaqCategoryFormData) => {
    const res = await $fetch<{ success: boolean; data: FaqCategory; message?: string }>('/api/faq-categories', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteCategory = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/faq-categories/${id}`, {
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
