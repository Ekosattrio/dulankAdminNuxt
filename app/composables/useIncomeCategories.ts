import type {
  IncomeCategoryItem,
  IncomeCategoryFormData,
  IncomeCategoryFilterParams
} from '#server/types/income-category'

interface ResponseData {
  success: boolean
  data: IncomeCategoryItem[]
  stats: {
    total: number
    active: number
    inactive: number
  }
}

interface MutationResponse {
  success: boolean
  data?: IncomeCategoryItem
  message?: string
}

const EMPTY_STATS = { total: 0, active: 0, inactive: 0 }

/**
 * Kategori pendapatan — backend Laravel `/api/v1/admin/income-categories`.
 */
export function useIncomeCategories(filterParams?: Ref<IncomeCategoryFilterParams> | IncomeCategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/income-categories', {
    key: 'income-categories-list',
    query
  })

  const items = computed<IncomeCategoryItem[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.stats ?? EMPTY_STATS)

  const saveCategory = async (payload: IncomeCategoryFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/income-categories/${encodeURIComponent(id)}` : '/api/v1/admin/income-categories',
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
      `/api/v1/admin/income-categories/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  return {
    items,
    stats,
    pending,
    error,
    refresh,
    saveCategory,
    deleteCategory
  }
}