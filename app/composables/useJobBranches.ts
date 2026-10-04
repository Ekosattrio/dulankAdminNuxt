import type { JobBranchFilterParams, JobBranchItem, JobBranchUpdatePayload } from '#server/types/job-branch'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export function useJobBranches(filterParams?: Ref<JobBranchFilterParams> | JobBranchFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ApiResponse<JobBranchItem[]>>('/api/job-branches', {
    key: 'job-branches-list',
    query: params,
  })

  const jobBranches = computed<JobBranchItem[]>(() => data.value?.data ?? [])

  const updateRecord = async (id: string, payload: JobBranchUpdatePayload) => {
    const res = await $fetch<ApiResponse<JobBranchItem>>(`/api/job-branches/${id}`, {
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
