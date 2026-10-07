import type { BlogCategory, BlogCategoryFormData } from '#server/types/blog'

interface ResponseData {
  success: boolean
  data: BlogCategory[]
  message?: string
}

export function useBlogCategories() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/blog-categories', {
    key: 'blog-categories-list'
  })

  const categories = computed<BlogCategory[]>(() => data.value?.data ?? [])

  const saveCategory = async (payload: BlogCategoryFormData) => {
    const res = await $fetch<{ success: boolean; data: BlogCategory; message?: string }>('/api/blog-categories', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteCategory = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/blog-categories/${id}`, {
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
