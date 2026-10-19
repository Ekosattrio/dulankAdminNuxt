import type { SubCategory, SubCategoryFormData, SubCategoryFilterParams } from '#server/types/sub-category'

interface ResponseData {
  success: boolean
  data: SubCategory[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: SubCategory
  message?: string
}

/**
 * Sub-kategori produk — backend Laravel `/api/v1/admin/sub-categories`.
 * Backend mengenali kategori lewat nama (`category`), sama seperti yang
 * dikirim form admin.
 */
export function useSubCategories(filterParams?: Ref<SubCategoryFilterParams> | SubCategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    category: params.value.category || undefined,
    status: params.value.status || undefined
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/sub-categories', {
    key: 'sub-categories-list',
    query
  })

  const subCategories = computed<SubCategory[]>(() => data.value?.data ?? [])

  const saveSubCategory = async (payload: SubCategoryFormData) => {
    const { id, categoryId, categoryCode, ...body } = payload
    void categoryId
    void categoryCode

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/sub-categories/${encodeURIComponent(id)}` : '/api/v1/admin/sub-categories',
      {
        method: id ? 'PUT' : 'POST',
        body: {
          category: body.category,
          name: body.name,
          description: body.description,
          status: body.status
        }
      }
    )

    await refresh()
    return res
  }

  const deleteSubCategory = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/sub-categories/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

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