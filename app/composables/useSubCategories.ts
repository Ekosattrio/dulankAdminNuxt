import type { SubCategory, SubCategoryFormData, SubCategoryFilterParams } from '#server/types/sub-category'

interface ResponseData {
  success: boolean
  data: SubCategory[]
  message?: string
}

export function useSubCategories(filterParams?: Ref<SubCategoryFilterParams> | SubCategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/sub-categories', {
    key: 'sub-categories-list',
    query: params
  })

  const subCategories = computed<SubCategory[]>(() => data.value?.data ?? [])

  const saveSubCategory = async (payload: SubCategoryFormData) => {
    const res = await apiFetch<{ success: boolean; data: SubCategory; message?: string }>('/api/sub-categories', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteSubCategory = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/sub-categories/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    subCategories,
    pending,
    error,
    refresh,
    saveSubCategory,
    deleteSubCategory
  }
}
