import type { PurchaseReturn, PurchaseReturnFormData, PurchaseReturnFilterParams } from '#server/types/purchase-return'

interface ResponseData {
  success: boolean
  data: PurchaseReturn[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: PurchaseReturn
  message?: string
}

const RELIST = '/api/v1/admin/purchase-returns'

/**
 * Retur pembelian — backend Laravel `/api/v1/admin/purchase-returns`.
 * Route mutasi memakai `{noPr}`; `id` di-resolve dari list.
 */
export function usePurchaseReturns(filterParams?: Ref<PurchaseReturnFilterParams> | PurchaseReturnFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined,
    startDate: params.value.startDate || undefined,
    endDate: params.value.endDate || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>(RELIST, {
    key: 'purchase-returns-list',
    query
  })

  const purchaseReturns = computed<PurchaseReturn[]>(() => data.value?.data ?? [])

  const resolveNo = (idOrNo: string): string => {
    return purchaseReturns.value.find(item => item.id === idOrNo || item.noPR === idOrNo)?.noPR ?? idOrNo
  }

  const savePurchaseReturn = async (payload: PurchaseReturnFormData) => {
    const { id, noPR, created, ...body } = payload
    void noPR
    void created

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

  const deletePurchaseReturn = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `${RELIST}/${encodeURIComponent(resolveNo(id))}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  const recordPayment = async (
    noPr: string,
    payload: { amount: number; method?: string; date?: string; notes?: string }
  ) => {
    const res = await apiFetch<MutationResponse>(
      `${RELIST}/${encodeURIComponent(resolveNo(noPr))}/payments`,
      { method: 'POST', body: payload }
    )

    await refresh()
    return res
  }

  return {
    purchaseReturns,
    pending,
    error,
    refresh,
    savePurchaseReturn,
    deletePurchaseReturn,
    recordPayment
  }
}