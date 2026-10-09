import type { SubscriptionItem, SubscriptionStats } from '#server/types/subscription'

interface SubscriptionResponse {
  success: boolean
  data: SubscriptionItem[]
  stats: SubscriptionStats
}

export function useSubscriptions() {
  const { data, pending, error, refresh } = useApiFetch<SubscriptionResponse>('/api/subscriptions', {
    default: () => ({
      success: false,
      data: [],
      stats: { totalTransactions: 0, totalSubscribers: 0, activeSubscribers: 0, expiredSubscribers: 0 }
    })
  })

  const subscriptions = computed<SubscriptionItem[]>(() => data.value?.data ?? [])
  const stats = computed<SubscriptionStats>(() => data.value?.stats ?? {
    totalTransactions: 0,
    totalSubscribers: 0,
    activeSubscribers: 0,
    expiredSubscribers: 0
  })

  async function saveSubscription(item: Partial<SubscriptionItem> & { subscriber: string }) {
    const res = await apiFetch<{ success: boolean; data: SubscriptionItem; message: string }>('/api/subscriptions', {
      method: 'POST',
      body: item
    })
    await refresh()
    return res
  }

  async function deleteSubscription(id: number) {
    const res = await apiFetch<{ success: boolean; message: string }>(`/api/subscriptions/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    subscriptions,
    stats,
    pending,
    error,
    refresh,
    saveSubscription,
    deleteSubscription
  }
}

