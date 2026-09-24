import type { Category, CategoryFormData, CategoryFilterParams } from '#server/types/category'

interface ResponseData {
  success: boolean
  data: Category[]
  message?: string
}

export function useCategories(filterParams?: Ref<CategoryFilterParams> | CategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/categories', {
    key: 'categories-list',
    query: params
  })

  const categories = computed<Category[]>(() => data.value?.data ?? [])

  const saveCategory = async (payload: CategoryFormData) => {
    const res = await $fetch<{ success: boolean; data: Category; message?: string }>('/api/categories', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteCategory = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/categories/${id}`, {
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
