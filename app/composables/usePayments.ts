import type { PaymentRecord, PaymentFilterParams } from '#server/types/payment'

interface ResponseData {
  success: boolean
  data: PaymentRecord[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: PaymentRecord
  message?: string
}

/**
 * Pembayaran (payment in/out) — backend Laravel `/api/v1/admin/payments`.
 *
 * Status backend: `Pending` / `Verified` / `Rejected` (verifikasi bukti bayar).
 */
export function usePayments(filterParams?: Ref<PaymentFilterParams> | PaymentFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => {
    const dateRange = {
      startDate: params.value.startDate || (params.value.date || ''),
      endDate: params.value.endDate || (params.value.date || '')
    }

    return {
      search: params.value.search || undefined,
      startDate: dateRange.startDate || undefined,
      endDate: dateRange.endDate || undefined,
      type: params.value.type || undefined,
      limit: 100
    }
  })

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/payments', {
    key: 'payments-list',
    query
  })

  const payments = computed<PaymentRecord[]>(() => data.value?.data ?? [])

  const recordPayment = async (payload: {
    type: string
    method: string
    amount: number
    date?: string
    payableType?: string
    payableId?: string
    notes?: string
  }) => {
    const res = await apiFetch<MutationResponse>('/api/v1/admin/payments', {
      method: 'POST',
      body: payload
    })

    await refresh()
    return res
  }

  const verifyPayment = async (id: string, note = '') => {
    const res = await apiFetch<MutationResponse>(
      `/api/v1/admin/payments/${encodeURIComponent(id)}/verify`,
      { method: 'POST', body: { note } }
    )

    await refresh()
    return res
  }

  const rejectPayment = async (id: string, note = '') => {
    const res = await apiFetch<MutationResponse>(
      `/api/v1/admin/payments/${encodeURIComponent(id)}/reject`,
      { method: 'POST', body: { note } }
    )

    await refresh()
    return res
  }

  return {
    payments,
    pending,
    error,
    refresh,
    recordPayment,
    verifyPayment,
    rejectPayment
  }
}