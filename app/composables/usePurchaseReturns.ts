import type { PurchaseReturn, PurchaseReturnFormData, PurchaseReturnFilterParams } from '#server/types/purchase-return'

export function usePurchaseReturns(filterParams?: Ref<PurchaseReturnFilterParams> | ComputedRef<PurchaseReturnFilterParams>) {
  const query = computed(() => {
    if (!filterParams) return {}
    return unref(filterParams)
  })

  const { data, pending, error, refresh } = useFetch<{
    success: boolean
    data: PurchaseReturn[]
    meta: { total: number }
  }>('/api/purchase-returns', {
    query,
    key: 'purchase-returns-list',
    watch: [query],
  })

  const purchaseReturns = computed(() => data.value?.data || [])

  async function savePurchaseReturn(form: PurchaseReturnFormData) {
    const res = await $fetch<{ success: boolean; data: PurchaseReturn; message: string }>('/api/purchase-returns', {
      method: 'POST',
      body: form
    })
    await refresh()
    return res
  }

  async function deletePurchaseReturn(id: string) {
    const res = await $fetch<{ success: boolean; message: string }>(`/api/purchase-returns/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    purchaseReturns,
    pending,
    error,
    refresh,
    savePurchaseReturn,
    deletePurchaseReturn
  }
}
