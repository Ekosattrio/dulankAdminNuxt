import type { CheckoutItem, CheckoutStats, CheckoutFilterQuery } from '#server/types/checkout'

interface ResponseData {
  success: boolean
  data: CheckoutItem[]
  stats?: CheckoutStats
  message?: string
}

interface CheckoutRow {
  id: string | number
  customer?: string | null
  date?: string | null
  total?: number
  amount?: number
  status?: string
}

export function useCheckouts(filterParams?: Ref<CheckoutFilterQuery> | CheckoutFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/webstore/checkout', {
    key: 'webstore-checkouts-list',
    query: params
  })

  const checkouts = computed<CheckoutItem[]>(() =>
    ((data.value?.data ?? []) as unknown as CheckoutRow[]).map(item => ({
      id: String(item.id),
      userEmail: item.customer ?? '',
      dateCheckout: item.date ?? '',
      payment: item.total ?? item.amount ?? 0,
      method: '',
      status: (item.status === 'Complete' ? 'Berhasil' : 'Gagal') as CheckoutItem['status'],
      voucher: '',
      deliveryFee: 0,
      detailProduct: '',
    })),
  )
  const stats = computed<CheckoutStats>(() => data.value?.stats ?? {
    totalCheckout: 0,
    totalRevenue: 0,
    totalSuccess: 0,
    totalFailed: 0
  })

  return {
    checkouts,
    stats,
    pending,
    error,
    refresh
  }
}
