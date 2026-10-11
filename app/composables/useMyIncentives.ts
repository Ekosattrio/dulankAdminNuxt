import type { MyIncentive, MyIncentiveFormData, MyIncentiveFilterParams, MyIncentiveStats } from '#server/types/my-incentive'

interface ResponseData {
  success: boolean
  data: MyIncentive[]
  stats?: MyIncentiveStats
  message?: string
}

export function useMyIncentives(filterParams?: Ref<MyIncentiveFilterParams> | MyIncentiveFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/my-incentives', {
    key: 'my-incentives-list',
    query: params
  })

  const myIncentives = computed<MyIncentive[]>(() => data.value?.data ?? [])
  const stats = computed<MyIncentiveStats>(() => data.value?.stats ?? {
    totalCount: myIncentives.value.reduce((acc, curr) => acc + (Number(curr.qty) || 0), 0),
    totalAmount: myIncentives.value.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
  })

  const saveMyIncentive = async (_payload: MyIncentiveFormData) => {
    void _payload

    throw new Error('Insentif dihitung dari penyelesaian job; halaman ini hanya pemantauan.')
  }

  
  const deleteMyIncentive = async (_id: string) => {
    void _id

    throw new Error('Insentif tidak dihapus manual; dibatalkan lewat job terkait.')
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
