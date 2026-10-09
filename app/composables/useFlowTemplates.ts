import type { FlowTemplate, FlowTemplateFilterParams, FlowTemplateFormData } from '#server/types/flow-template'

interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: Record<string, unknown>
  message?: string
}

export function useFlowTemplates(filterParams?: Ref<FlowTemplateFilterParams> | FlowTemplateFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ApiResponse<FlowTemplate[]>>('/api/flow-templates', {
    key: 'flow-templates-list',
    query: params,
  })

  const flowTemplates = computed<FlowTemplate[]>(() => data.value?.data ?? [])

  const saveFlowTemplate = async (payload: FlowTemplateFormData) => {
    let res: ApiResponse<FlowTemplate>
    if (payload.id) {
      res = await apiFetch<ApiResponse<FlowTemplate>>(`/api/flow-templates/${payload.id}`, {
        method: 'PUT',
        body: payload,
      })
    } else {
      res = await apiFetch<ApiResponse<FlowTemplate>>('/api/flow-templates', {
        method: 'POST',
        body: payload,
      })
    }
    await refresh()
    return res
  }

  const deleteFlowTemplate = async (id: string) => {
    const res = await apiFetch<ApiResponse<FlowTemplate>>(`/api/flow-templates/${id}`, {
      method: 'DELETE',
    })
    await refresh()
    return res
  }

  return {
    flowTemplates,
    pending,
    error,
    refresh,
    saveFlowTemplate,
    deleteFlowTemplate,
  }
}
