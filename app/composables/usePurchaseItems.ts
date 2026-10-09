import type { PurchaseItem, PurchaseItemFormData, PurchaseItemFilterParams } from '#server/types/purchase-item'

interface ResponseData {
  success: boolean
  data: PurchaseItem[]
  meta?: { total: number }
  message?: string
}

export function usePurchaseItems(filterParams?: Ref<PurchaseItemFilterParams> | PurchaseItemFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/purchase-items', {
    key: 'purchase-items-list',
    query: params
  })

  const items = computed<PurchaseItem[]>(() => data.value?.data ?? [])

  const saveItem = async (payload: PurchaseItemFormData) => {
    const res = await apiFetch<{ success: boolean; data: PurchaseItem; message?: string }>('/api/purchase-items', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteItem = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/purchase-items/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    items,
    pending,
    error,
    refresh,
    saveItem,
    deleteItem
  }
}
