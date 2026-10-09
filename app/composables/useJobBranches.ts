import type {
  JobBranchFilterParams,
  JobBranchHistoryItem,
  JobBranchItem,
  JobBranchUpdatePayload,
} from '#server/types/job-branch'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export function useJobBranches(filterParams?: Ref<JobBranchFilterParams> | JobBranchFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ApiResponse<JobBranchItem[]>>('/api/job-branches', {
    key: 'job-branches-list',
    query: params,
  })

  const jobBranches = computed<JobBranchItem[]>(() => data.value?.data ?? [])

  const updateRecord = async (id: string, payload: JobBranchUpdatePayload) => {
    const res = await apiFetch<ApiResponse<JobBranchItem>>(`/api/job-branches/${id}`, {
      method: 'PUT',
      body: payload,
    })
    await refresh()
    return res
  }

  return {
    jobBranches,
    pending,
    error,
    refresh,
    updateRecord,
  }
}

export function useJobBranchHistory(filterParams: Ref<JobBranchFilterParams>) {
  const { data, pending, error, refresh } = useApiFetch<ApiResponse<JobBranchHistoryItem[]>>(
    '/api/job-branches/history',
    { key: 'job-branches-history', query: filterParams },
  )

  return {
    historyItems: computed<JobBranchHistoryItem[]>(() => data.value?.data ?? []),
    pending,
    error,
    refresh,
  }
}
