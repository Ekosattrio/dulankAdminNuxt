import type { JobOrder, JobOrderFormData, JobOrderFilterParams } from '#server/types/job-order'

interface ResponseData {
  success: boolean
  data: JobOrder[]
  message?: string
}

export function useJobOrders(filterParams?: Ref<JobOrderFilterParams> | JobOrderFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/job-orders', {
    key: 'job-orders-list',
    query: params
  })

  const jobOrders = computed<JobOrder[]>(() => data.value?.data ?? [])

  const saveJobOrder = async (payload: JobOrderFormData) => {
    const res = await apiFetch<{ success: boolean; data: JobOrder; message?: string }>('/api/job-orders', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteJobOrder = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/job-orders/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    jobOrders,
    pending,
    error,
    refresh,
    saveJobOrder,
    deleteJobOrder
  }
}
