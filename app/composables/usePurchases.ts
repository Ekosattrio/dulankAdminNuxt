import type { Purchase, PurchaseFormData, PurchaseFilterParams } from '#server/types/purchase'

interface ResponseData {
  success: boolean
  data: Purchase[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: Purchase
  message?: string
}

const RELIST = '/api/v1/admin/purchases'

/**
 * Pembelian (goods receipt) — backend Laravel `/api/v1/admin/purchases`.
 * Route mutasi memakai `{noPurchase}`; `id` di-resolve dari list.
 */
export function usePurchases(filterParams?: Ref<PurchaseFilterParams> | PurchaseFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined,
    paymentStatus: params.value.paymentStatus || undefined,
    startDate: params.value.startDate || undefined,
    endDate: params.value.endDate || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>(RELIST, {
    key: 'purchases-list',
    query
  })

  const purchases = computed<Purchase[]>(() => data.value?.data ?? [])

  const resolveNo = (idOrNo: string): string => {
    return purchases.value.find(purchase => purchase.id === idOrNo || purchase.noPurchase === idOrNo)
      ?.noPurchase ?? idOrNo
  }

  const savePurchase = async (payload: PurchaseFormData) => {
    const { id, noPurchase, created, paymentStatus, ...body } = payload
    void noPurchase
    void created
    void paymentStatus

    const res = await apiFetch<MutationResponse>(
      id ? `${RELIST}/${encodeURIComponent(resolveNo(id))}` : RELIST,
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deletePurchase = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `${RELIST}/${encodeURIComponent(resolveNo(id))}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  const recordPayment = async (
    noPurchase: string,
    payload: { amount: number; method?: string; date?: string; notes?: string }
  ) => {
    const res = await apiFetch<MutationResponse>(
      `${RELIST}/${encodeURIComponent(resolveNo(noPurchase))}/payments`,
      { method: 'POST', body: payload }
    )

    await refresh()
    return res
  }

  return {
    purchases,
    pending,
    error,
    refresh,
    savePurchase,
    deletePurchase,
    recordPayment
  }
}