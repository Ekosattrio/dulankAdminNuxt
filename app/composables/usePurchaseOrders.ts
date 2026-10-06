import type { PurchaseOrder, PurchaseOrderFormData, PurchaseOrderFilterParams } from '#server/types/purchase-order'

export function usePurchaseOrders(filterParams?: Ref<PurchaseOrderFilterParams> | ComputedRef<PurchaseOrderFilterParams>) {
  const query = computed(() => {
    if (!filterParams) return {}
    return unref(filterParams)
  })

  const { data, pending, error, refresh } = useFetch<{
    success: boolean
    data: PurchaseOrder[]
    meta: { total: number }
  }>('/api/purchase-orders', {
    query,
    key: 'purchase-orders-list',
    watch: [query],
  })

  const purchaseOrders = computed(() => data.value?.data || [])

  async function savePurchaseOrder(form: PurchaseOrderFormData) {
    const res = await $fetch<{ success: boolean; data: PurchaseOrder; message: string }>('/api/purchase-orders', {
      method: 'POST',
      body: form
    })
    await refresh()
    return res
  }

  async function deletePurchaseOrder(id: string) {
    const res = await $fetch<{ success: boolean; message: string }>(`/api/purchase-orders/${id}`, {
      method: 'DELETE'
    })
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
