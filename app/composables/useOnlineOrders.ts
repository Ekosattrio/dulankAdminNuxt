import type { OnlineOrder, OnlineOrderFormData } from '#server/types/online-order'

export function useOnlineOrders(filterParams?: Ref<{ search?: string; status?: string; paymentStatus?: string } | undefined>) {
  const { data: response, pending, error, refresh } = useApiFetch<{ success: boolean; data: OnlineOrder[]; message?: string }>(
    '/api/online-orders',
    {
      key: 'online-orders-list',
      query: filterParams,
      lazy: false,
    }
  )

  const orders = computed<OnlineOrder[]>(() => response.value?.data || [])

  async function saveOrder(formData: OnlineOrderFormData & { id?: number | string }) {
    const res = await apiFetch<{ success: boolean; data: OnlineOrder; message?: string }>('/api/online-orders', {
      method: 'POST',
      body: formData,
    })
    await refresh()
    return res
  }

  async function recordPayment(id: number | string, amount: number, paymentMethod: string) {
    const res = await apiFetch<{ success: boolean; data: OnlineOrder; message?: string }>(`/api/online-orders/${id}/pay`, {
      method: 'POST',
      body: { amount, paymentMethod },
    })
    await refresh()
    return res
  }

  async function deleteOrder(id: number | string) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/online-orders/${id}`, {
      method: 'DELETE',
    })
    await refresh()
    return res
  }

  return {
    orders,
    pending,
    error,
    refresh,
    saveOrder,
    recordPayment,
    deleteOrder,
  }
}

