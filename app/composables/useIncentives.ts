import type { IncentiveItem, IncentiveFormData, IncentiveFilterParams } from '#server/types/incentive'

interface ResponseData {
  success: boolean
  data: IncentiveItem[]
  message?: string
}

export function useIncentives(filterParams?: Ref<IncentiveFilterParams> | IncentiveFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/incentives', {
    key: 'incentives-list',
    query: params
  })

  const incentives = computed<IncentiveItem[]>(() => data.value?.data ?? [])

  const saveIncentive = async (payload: IncentiveFormData) => {
    const res = await apiFetch<{ success: boolean; data: IncentiveItem; message?: string }>('/api/incentives', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteIncentive = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/incentives/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    incentives,
    pending,
    error,
    refresh,
    saveIncentive,
    deleteIncentive
  }
}
