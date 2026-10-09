import type { Discount, DiscountFormData } from '#server/types/promo'

export function useDiscounts(filterParams?: Ref<{ search?: string; planId?: string; status?: string } | undefined>) {
  const { data: response, pending, error, refresh } = useApiFetch<{ success: boolean; data: Discount[]; message?: string }>('/api/discounts', {
    key: 'discounts-data',
    query: filterParams,
    lazy: false
  })

  const discounts = computed<Discount[]>(() => response.value?.data || [])

  async function saveDiscount(payload: DiscountFormData) {
    const res = await apiFetch<{ success: boolean; data: Discount; message?: string }>('/api/discounts', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  async function deleteDiscount(id: string) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/discounts/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    discounts,
    pending,
    error,
    refresh,
    saveDiscount,
    deleteDiscount
  }
}

