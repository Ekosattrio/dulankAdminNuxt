import type { CustomerSubscriptionItem, CustomerSubscriptionQuery, CustomerSubscriptionSummary, SubscribePayload } from '#server/types/customer-subscription'

interface ListResponse {
  success: boolean
  data: CustomerSubscriptionItem[]
  summary: CustomerSubscriptionSummary
}

interface MutationResponse {
  success: boolean
  data?: CustomerSubscriptionItem
  message?: string
}

/**
 * Subskripsi pelanggan (relasi Customer↔Subscription) — backend
 * `/api/v1/admin/customer-subscriptions` + `/subscriptions`.
 */
export function useCustomerSubscriptions(filterParams?: Ref<CustomerSubscriptionQuery> | CustomerSubscriptionQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined,
    plan: params.value.plan || undefined,
  }))

  const { data, pending, error, refresh } = useApiFetch<ListResponse>('/api/v1/admin/customer-subscriptions', {
    key: 'customer-subscriptions-list',
    query,
  })

  const rows = computed<CustomerSubscriptionItem[]>(() => data.value?.data ?? [])
  const summary = computed<CustomerSubscriptionSummary>(() => data.value?.summary ?? {
    totalSubscribers: 0,
    activeSubscribers: 0,
    expiredSubscribers: 0,
  })

  const subscribe = async (payload: SubscribePayload) => {
    const res = await apiFetch<MutationResponse>('/api/v1/admin/subscriptions', {
      method: 'POST',
      body: payload,
    })
    await refresh()
    return res
  }

  const updateSubscription = async (id: string, payload: Partial<SubscribePayload>) => {
    const res = await apiFetch<MutationResponse>(`/api/v1/admin/subscriptions/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: payload,
    })
    await refresh()
    return res
  }

  return {
    rows,
    summary,
    pending,
    error,
    refresh,
    subscribe,
    updateSubscription,
  }
}