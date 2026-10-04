import type { Order, OrderFilterParams, OrderFormData, OrderStats, OrderStatus } from '#server/types/order'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export function useOrders(filterParams?: Ref<OrderFilterParams> | OrderFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh: refreshOrders } = useFetch<ApiResponse<Order[]>>('/api/orders', {
    key: 'orders-list',
    query: params,
  })

  const { data: statsData, refresh: refreshStats } = useFetch<ApiResponse<OrderStats>>('/api/orders/stats', {
    key: 'orders-stats',
  })

  const orders = computed<Order[]>(() => data.value?.data ?? [])
  const stats = computed<OrderStats | null>(() => statsData.value?.data ?? null)

  const refresh = async () => {
    await Promise.all([refreshOrders(), refreshStats()])
  }

  const updateStatus = async (id: string, status: OrderStatus) => {
    const res = await $fetch<ApiResponse<Order>>(`/api/orders/${id}`, {
      method: 'PUT',
      body: { status },
    })
    await refresh()
    return res
  }

  const saveOrder = async (payload: OrderFormData) => {
    let res: ApiResponse<Order>
    if (payload.id) {
      res = await $fetch<ApiResponse<Order>>(`/api/orders/${payload.id}`, {
        method: 'PUT',
        body: payload,
      })
    } else {
      res = await $fetch<ApiResponse<Order>>('/api/orders', {
        method: 'POST',
        body: payload,
      })
    }
    await refresh()
    return res
  }

  const deleteOrder = async (id: string) => {
    const res = await $fetch<ApiResponse<Order>>(`/api/orders/${id}`, {
      method: 'DELETE',
    })
    await refresh()
    return res
  }

  return {
    orders,
    stats,
    pending,
    error,
    refresh,
    updateStatus,
    saveOrder,
    deleteOrder,
  }
}
