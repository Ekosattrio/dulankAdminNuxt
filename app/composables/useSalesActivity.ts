import type { SalesHistoryEntry, SalesPayment } from '#server/types/sales-document'

interface ApiResponse<T> {
  success?: boolean
  data: T
  message?: string
}

export function useSalesHistory() {
  const { data, pending, error, refresh } = useApiFetch<ApiResponse<SalesHistoryEntry[]>>(
    '/api/v1/admin/sales',
    { key: 'sales-history' },
  )

  return {
    history: computed<SalesHistoryEntry[]>(() => data.value?.data ?? []),
    pending,
    error,
    refresh,
  }
}

export function useSalesPayments() {
  async function addPayment(saleId: string, payload: Pick<SalesPayment, 'amount' | 'method' | 'notes'>) {
    return apiFetch<ApiResponse<unknown>>(`/api/v1/admin/sales/${encodeURIComponent(saleId)}/payments`, {
      method: 'POST',
      body: payload,
    })
  }

  return { addPayment }
}
