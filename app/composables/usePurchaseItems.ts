import type { PurchaseItem, PurchaseItemFormData, PurchaseItemFilterParams } from '#server/types/purchase-item'

interface ResponseData {
  success: boolean
  data: PurchaseItem[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: PurchaseItem
  message?: string
}

/**
 * Item pembelian — backend Laravel `/api/v1/admin/purchase-items`.
 * Kategori dikenali via nama (`category`).
 */
export function usePurchaseItems(filterParams?: Ref<PurchaseItemFilterParams> | PurchaseItemFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    category: params.value.category || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/purchase-items', {
    key: 'purchase-items-list',
    query
  })

  const items = computed<PurchaseItem[]>(() => data.value?.data ?? [])

  const saveItem = async (payload: PurchaseItemFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/purchase-items/${encodeURIComponent(id)}` : '/api/v1/admin/purchase-items',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteItem = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/purchase-items/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

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