import type { WorkFlow, WorkFlowFormData, WorkFlowFilterParams } from '#server/types/work-flow'

interface ResponseData {
  success: boolean
  data: WorkFlow[]
  message?: string
}

export function useWorkFlows(filterParams?: Ref<WorkFlowFilterParams> | WorkFlowFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/work-flows', {
    key: 'work-flows-list',
    query: params
  })

  const workFlows = computed<WorkFlow[]>(() => data.value?.data ?? [])

  const saveWorkFlow = async (payload: WorkFlowFormData) => {
    const res = await $fetch<{ success: boolean; data: WorkFlow; message?: string }>('/api/work-flows', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteWorkFlow = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/work-flows/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    workFlows,
    pending,
    error,
    refresh,
    saveWorkFlow,
    deleteWorkFlow
  }
}
