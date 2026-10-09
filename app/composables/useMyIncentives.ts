import type { MyIncentive, MyIncentiveFormData, MyIncentiveFilterParams, MyIncentiveStats } from '#server/types/my-incentive'

interface ResponseData {
  success: boolean
  data: MyIncentive[]
  stats?: MyIncentiveStats
  message?: string
}

export function useMyIncentives(filterParams?: Ref<MyIncentiveFilterParams> | MyIncentiveFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/my-incentives', {
    key: 'my-incentives-list',
    query: params
  })

  const myIncentives = computed<MyIncentive[]>(() => data.value?.data ?? [])
  const stats = computed<MyIncentiveStats>(() => data.value?.stats ?? {
    totalCount: myIncentives.value.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0),
    totalAmount: myIncentives.value.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
  })

  const saveMyIncentive = async (payload: MyIncentiveFormData) => {
    const res = await apiFetch<{ success: boolean; data: MyIncentive; message?: string }>('/api/my-incentives', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteMyIncentive = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/my-incentives/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    myIncentives,
    stats,
    pending,
    error,
    refresh,
    saveMyIncentive,
    deleteMyIncentive
  }
}
