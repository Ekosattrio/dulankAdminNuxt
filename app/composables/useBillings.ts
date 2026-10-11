import type { BillingQuery, BillingRecord, BillingSummary } from '#server/types/billing'
interface Response { success: boolean; data: BillingRecord[]; summary: BillingSummary }
export function useBillings(query: Ref<BillingQuery>) {
  const { data, pending, error, refresh } = useApiFetch<Response>('/api/billings', { key: 'billings-list', query })
  return {
    billings: computed(() => data.value?.data ?? []),
    summary: computed(() => data.value?.summary ?? { totalTransaction: 0, totalSuccess: 0, totalFailed: 0 }),
    pending, error, refresh,
  }
}
