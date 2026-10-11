import type { Order, OrderFilterParams, OrderFormData, OrderStats, OrderStatus } from '#server/types/order'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

const BASE = '/api/v1/admin/orders'

/**
 * Monitoring order (webstore) — backend Laravel `/api/v1/admin/orders`.
 *
 * Backend memantau order yang dibuat lewat store/quotation (tidak ada
 * create/delete dari sisi admin), sehingga:
 * - `updateStatus` → `POST /orders/{number}/status`,
 * - `deleteOrder` dipetakan menjadi pembatalan (status `Cancel`),
 * - `saveOrder` hanya berlaku untuk order yang sudah ada (perubahan status).
 */
export function useOrders(filterParams?: Ref<OrderFilterParams> | OrderFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    shipping: params.value.shipping || undefined,
    status: params.value.status || undefined,
    startDate: params.value.startDate || undefined,
    endDate: params.value.endDate || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh: refreshOrders } = useApiFetch<ApiResponse<Order[]>>(BASE, {
    key: 'orders-list',
    query
  })

  const { data: statsData, refresh: refreshStats } = useApiFetch<ApiResponse<OrderStats>>(`${BASE}/stats`, {
    key: 'orders-stats'
  })

  const orders = computed<Order[]>(() => data.value?.data ?? [])
  const stats = computed<OrderStats | null>(() => statsData.value?.data ?? null)

  const refresh = async () => {
    await Promise.all([refreshOrders(), refreshStats()])
  }

  /**
   * Route backend memakai nomor order (`{number}`); terima `id` maupun `no`.
   */
  const resolveNumber = (idOrNo: string): string => {
    return orders.value.find(order => order.id === idOrNo || order.no === idOrNo)?.no ?? idOrNo
  }

  const updateStatus = async (id: string, status: OrderStatus) => {
    const res = await apiFetch<ApiResponse<Order>>(
      `${BASE}/${encodeURIComponent(resolveNumber(id))}/status`,
      {
        method: 'POST',
        body: { status }
      }
    )

    await refresh()
    return res
  }

  const saveOrder = async (payload: OrderFormData) => {
    if (!payload.id || !payload.status) {
      throw new Error('Order dibuat lewat store/web; admin hanya memantau dan mengubah status.')
    }

    return await updateStatus(payload.id, payload.status)
  }

  const deleteOrder = async (id: string) => {
    return await updateStatus(id, 'Cancel')
  }

  return {
    orders,
    stats,
    pending,
    error,
    refresh,
    updateStatus,
    saveOrder,
    deleteOrder
  }
}