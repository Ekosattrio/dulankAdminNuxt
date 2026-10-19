import type {
  SubscriptionFilterQuery,
  SubscriptionRecord,
  SubscriptionSummary,
  SubscriptionUpdateCommand,
} from '#server/types/subscription'

interface SubscriptionListResponse {
  success: boolean
  data: SubscriptionRecord[]
  summary: SubscriptionSummary
}

const emptySummary: SubscriptionSummary = {
  totalTransactions: 0,
  totalSubscribers: 0,
  activeSubscribers: 0,
  expiredSubscribers: 0,
}

export function useSubscriptions(filters: Ref<SubscriptionFilterQuery>) {
  const { data, pending, error, refresh } = useApiFetch<SubscriptionListResponse>('/api/v1/admin/subscriptions', {
    key: 'subscriptions-list',
    query: filters,
  })

  const subscriptions = computed(() => data.value?.data ?? [])
  const summary = computed(() => data.value?.summary ?? emptySummary)

  async function updateSubscription(id: string, payload: SubscriptionUpdateCommand) {
    const response = await apiFetch<{ success: boolean; data: SubscriptionRecord; message: string }>(`/api/v1/admin/subscriptions/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: payload,
    })
    await refresh()
    return response
  }

  async function deleteSubscription(id: string) {
    const response = await apiFetch<{ success: boolean; data: SubscriptionRecord; message: string }>(`/api/v1/admin/subscriptions/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    await refresh()
    return response
  }

  return { subscriptions, summary, pending, error, refresh, updateSubscription, deleteSubscription }
}
