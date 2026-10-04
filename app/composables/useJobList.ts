import type { FlowSummary, JobListFilterParams, JobListItem } from '#server/types/job-list'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export function useJobList(filterParams?: Ref<JobListFilterParams> | JobListFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh: refreshList } = useFetch<ApiResponse<JobListItem[]>>('/api/job-list', {
    key: 'job-list-data',
    query: params,
  })

  const { data: flowsData, refresh: refreshFlows } = useFetch<ApiResponse<FlowSummary[]>>('/api/job-list/flows', {
    key: 'job-list-flows',
  })

  const jobList = computed<JobListItem[]>(() => data.value?.data ?? [])
  const flows = computed<FlowSummary[]>(() => flowsData.value?.data ?? [])

  const refresh = async () => {
    await Promise.all([refreshList(), refreshFlows()])
  }

  return {
    jobList,
    flows,
    pending,
    error,
    refresh,
  }
}
