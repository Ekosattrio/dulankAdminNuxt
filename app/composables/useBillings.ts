import type { BillingItem, BillingStats } from '#server/types/billing'

interface BillingResponse {
  success: boolean
  data: BillingItem[]
  stats: BillingStats
}

export function useBillings() {
  const { data, pending, error, refresh } = useApiFetch<BillingResponse>('/api/billings', {
    default: () => ({
      success: false,
      data: [],
      stats: { totalTransaction: 0, totalSuccess: 0, totalFailed: 0 }
    })
  })

  const billings = computed<BillingItem[]>(() => data.value?.data ?? [])
  const stats = computed<BillingStats>(() => data.value?.stats ?? { totalTransaction: 0, totalSuccess: 0, totalFailed: 0 })

  return {
    billings,
    stats,
    pending,
    error,
    refresh
  }
}

