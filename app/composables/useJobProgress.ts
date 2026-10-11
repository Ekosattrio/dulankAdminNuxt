import type { JobProgress, JobProgressFilters, JobProgressStats, JobProgressUpdate } from '#server/types/job-progress'

interface ResponseData {
  success: boolean
  data: JobProgress[]
  message?: string
  meta?: { stats?: JobProgressStats }
}

export function useJobProgress(filterParams?: Ref<JobProgressFilters> | JobProgressFilters) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/job-progress', { key: 'job-progress-list', query: params })
  const items = computed(() => data.value?.data ?? [])
  const stats = computed<JobProgressStats>(() => data.value?.meta?.stats ?? { total: 0, completed: 0, pending: 0 })

  async function update(id: string, payload: JobProgressUpdate) {
    const response = await apiFetch<{ success: boolean; data: JobProgress; message?: string }>(`/api/v1/admin/job-progress/${encodeURIComponent(id)}`, { method: 'PUT', body: payload })
    await refresh()
    return response
  }

  return { items, stats, pending, error, refresh, update }
}
