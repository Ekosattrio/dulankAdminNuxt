import type { MyIncentive, MyIncentiveFormData, MyIncentiveFilterParams } from '#server/types/my-incentive'

interface ResponseData {
  success: boolean
  data: MyIncentive[]
  message?: string
}

export function useMyIncentives(filterParams?: Ref<MyIncentiveFilterParams> | MyIncentiveFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/my-incentives', {
    key: 'my-incentives-list',
    query: params
  })

  const myIncentives = computed<MyIncentive[]>(() => data.value?.data ?? [])

  const saveMyIncentive = async (payload: MyIncentiveFormData) => {
    const res = await $fetch<{ success: boolean; data: MyIncentive; message?: string }>('/api/my-incentives', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteMyIncentive = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/my-incentives/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    myIncentives,
    pending,
    error,
    refresh,
    saveMyIncentive,
    deleteMyIncentive
  }
}
