import type { PaymentRecord, PaymentFilterParams } from '#server/types/payment'

interface ResponseData {
  success: boolean
  data: PaymentRecord[]
  message?: string
}

export function usePayments(filterParams?: Ref<PaymentFilterParams> | PaymentFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/payments', {
    key: 'payments-list',
    query: params,
  })

  const payments = computed<PaymentRecord[]>(() => data.value?.data ?? [])

  return {
    payments,
    pending,
    error,
    refresh,
  }
}
