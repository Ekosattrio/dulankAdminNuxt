import type { FlowCategory, FlowCategoryFilterParams, FlowCategoryFormData } from '#server/types/flow-category'

interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: Record<string, unknown>
  message?: string
}

export function useFlowCategories(filterParams?: Ref<FlowCategoryFilterParams> | FlowCategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ApiResponse<FlowCategory[]>>('/api/flow-categories', {
    key: 'flow-categories-list',
    query: params,
  })

  const flowCategories = computed<FlowCategory[]>(() => data.value?.data ?? [])

  const saveFlowCategory = async (payload: FlowCategoryFormData) => {
    let res: ApiResponse<FlowCategory>
    if (payload.id) {
      res = await apiFetch<ApiResponse<FlowCategory>>(`/api/flow-categories/${payload.id}`, {
        method: 'PUT',
        body: payload,
      })
    } else {
      res = await apiFetch<ApiResponse<FlowCategory>>('/api/flow-categories', {
        method: 'POST',
        body: payload,
      })
    }
    await refresh()
    return res
  }

  const deleteFlowCategory = async (id: string) => {
    const res = await apiFetch<ApiResponse<FlowCategory>>(`/api/flow-categories/${id}`, {
      method: 'DELETE',
    })
    await refresh()
    return res
  }

  return {
    flowCategories,
    pending,
    error,
    refresh,
    saveFlowCategory,
    deleteFlowCategory,
  }
}
