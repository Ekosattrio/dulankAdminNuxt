import type { IncentiveItem, IncentiveFormData, IncentiveFilterParams } from '#server/types/incentive'

interface ResponseData {
  success: boolean
  data: IncentiveItem[]
  message?: string
}

export function useIncentives(filterParams?: Ref<IncentiveFilterParams> | IncentiveFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/incentives', {
    key: 'incentives-list',
    query: params
  })

  const incentives = computed<IncentiveItem[]>(() => data.value?.data ?? [])

  const saveIncentive = async (payload: IncentiveFormData) => {
    const res = await apiFetch<{ success: boolean; data: IncentiveItem; message?: string }>('/api/v1/admin/incentives', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteIncentive = async (_id: string) => {
    void _id

    throw new Error('Insentif tidak dihapus; gunakan pembayaran/status untuk mengelolanya.')
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
