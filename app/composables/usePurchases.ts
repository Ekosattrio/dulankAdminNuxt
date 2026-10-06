import type { Purchase, PurchaseFormData, PurchaseFilterParams } from '#server/types/purchase'

interface ResponseData {
  success: boolean
  data: Purchase[]
  meta?: { total: number }
  message?: string
}

export function usePurchases(filterParams?: Ref<PurchaseFilterParams> | PurchaseFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/purchases', {
    key: 'purchases-list',
    query: params
  })

  const purchases = computed<Purchase[]>(() => data.value?.data ?? [])

  const savePurchase = async (payload: PurchaseFormData) => {
    const res = await $fetch<{ success: boolean; data: Purchase; message?: string }>('/api/purchases', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deletePurchase = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/purchases/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    purchases,
    pending,
    error,
    refresh,
    savePurchase,
    deletePurchase
  }
}
