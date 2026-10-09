import type {
  PaymentBalanceEntry,
  PaymentFlowFilterParams,
  PaymentFlowFormData,
  PaymentFlowKind,
  PaymentFlowRecord,
} from '#server/types/payment-flow'

interface ResponseData {
  success: boolean
  data: PaymentFlowRecord[]
  message?: string
  meta?: {
    balances?: PaymentBalanceEntry[]
  }
}

export function usePaymentFlow(kind: PaymentFlowKind, filterParams?: Ref<PaymentFlowFilterParams> | PaymentFlowFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})
  const baseUrl = kind === 'inflow' ? '/api/payment-inflow' : '/api/payment-outflow'
  const { data, pending, error, refresh } = useApiFetch<ResponseData>(baseUrl, {
    key: `payment-${kind}-list`,
    query: params,
  })
  const records = computed<PaymentFlowRecord[]>(() => data.value?.data ?? [])
  const balances = computed<PaymentBalanceEntry[]>(() => data.value?.meta?.balances ?? [])

  async function saveRecord(payload: PaymentFlowFormData) {
    const res = await apiFetch<{ success: boolean; data: PaymentFlowRecord; message?: string }>(baseUrl, {
      method: 'POST',
      body: payload,
    })
    await refresh()
    return res
  }

  async function deleteRecord(id: string) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`${baseUrl}/${id}`, {
      method: 'DELETE',
    })
    await refresh()
    return res
  }

  return {
    records,
    balances,
    pending,
    error,
    refresh,
    saveRecord,
    deleteRecord,
  }
}
