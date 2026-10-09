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

export function useIncomeCategories(filterParams?: Ref<IncomeCategoryFilterParams> | IncomeCategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/income-categories', {
    key: 'income-categories-list',
    query: params
  })

  const items = computed<IncomeCategoryItem[]>(() => data.value?.data ?? [])
  const stats = computed(() => data.value?.stats ?? { total: 0, active: 0, inactive: 0 })

  const saveCategory = async (payload: IncomeCategoryFormData) => {
    const res = await apiFetch<{ success: boolean; data: IncomeCategoryItem; message?: string }>('/api/income-categories', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteCategory = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/income-categories/${id}`, {
      method: 'DELETE'
    })
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

