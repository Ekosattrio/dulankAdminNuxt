import type { CheckoutItem, CheckoutStats, CheckoutFilterQuery } from '#server/types/checkout'

interface ResponseData {
  success: boolean
  data: CheckoutItem[]
  stats?: CheckoutStats
  message?: string
}

export function useCheckouts(filterParams?: Ref<CheckoutFilterQuery> | CheckoutFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/webstore/checkout', {
    key: 'webstore-checkouts-list',
    query: params
  })

  const checkouts = computed<CheckoutItem[]>(() => data.value?.data ?? [])
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
