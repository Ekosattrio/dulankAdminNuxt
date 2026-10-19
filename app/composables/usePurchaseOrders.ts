import type { PurchaseOrder, PurchaseOrderFormData, PurchaseOrderFilterParams } from '#server/types/purchase-order'

interface ResponseData {
  success: boolean
  data: PurchaseOrder[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: PurchaseOrder
  message?: string
}

const RELIST = '/api/v1/admin/purchase-orders'

/**
 * Purchase Order — backend Laravel `/api/v1/admin/purchase-orders`.
 * Route mutasi memakai `{noPo}`; `id` di-resolve dari list.
 */
export function usePurchaseOrders(filterParams?: Ref<PurchaseOrderFilterParams> | PurchaseOrderFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined,
    goodsStatus: params.value.goodsStatus || undefined,
    startDate: params.value.startDate || undefined,
    endDate: params.value.endDate || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>(RELIST, {
    key: 'purchase-orders-list',
    query
  })

  const purchaseOrders = computed<PurchaseOrder[]>(() => data.value?.data ?? [])

  const resolveNo = (idOrNo: string): string => {
    return purchaseOrders.value.find(order => order.id === idOrNo || order.noPO === idOrNo)?.noPO ?? idOrNo
  }

  const savePurchaseOrder = async (payload: PurchaseOrderFormData) => {
    const { id, noPO, created, ...body } = payload
    void noPO
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

  const deletePurchaseOrder = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `${RELIST}/${encodeURIComponent(resolveNo(id))}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  return {
    purchaseOrders,
    pending,
    error,
    refresh,
    savePurchaseOrder,
    deletePurchaseOrder
  }
}