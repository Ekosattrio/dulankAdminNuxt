import type { FlowName, FlowNameFilterParams, FlowNameFormData } from '#server/types/flow-name'

interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: Record<string, unknown>
  message?: string
}

export function useFlowNames(filterParams?: Ref<FlowNameFilterParams> | FlowNameFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ApiResponse<FlowName[]>>('/api/flow-names', {
    key: 'flow-names-list',
    query: params,
  })

  const flowNames = computed<FlowName[]>(() => data.value?.data ?? [])

  const saveFlowName = async (payload: FlowNameFormData) => {
    let res: ApiResponse<FlowName>
    if (payload.id) {
      res = await apiFetch<ApiResponse<FlowName>>(`/api/flow-names/${payload.id}`, {
        method: 'PUT',
        body: payload,
      })
    } else {
      res = await apiFetch<ApiResponse<FlowName>>('/api/flow-names', {
        method: 'POST',
        body: payload,
      })
    }
    await refresh()
    return res
  }

  const deleteFlowName = async (id: string) => {
    const res = await apiFetch<ApiResponse<FlowName>>(`/api/flow-names/${id}`, {
      method: 'DELETE',
    })
    await refresh()
    return res
  }

  return {
    flowNames,
    pending,
    error,
    refresh,
    saveFlowName,
    deleteFlowName,
  }
}
