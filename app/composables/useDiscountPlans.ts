import type { DiscountPlan, DiscountPlanFormData } from '#server/types/promo'

export function useDiscountPlans(filterParams?: Ref<{ search?: string; status?: string } | undefined>) {
  const { data: response, pending, error, refresh } = useApiFetch<{ success: boolean; data: DiscountPlan[]; message?: string }>('/api/discount-plans', {
    key: 'discount-plans-data',
    query: filterParams,
    lazy: false
  })

  const discountPlans = computed<DiscountPlan[]>(() => response.value?.data || [])

  async function saveDiscountPlan(payload: DiscountPlanFormData) {
    const res = await apiFetch<{ success: boolean; data: DiscountPlan; message?: string }>('/api/discount-plans', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  async function deleteDiscountPlan(id: string) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/discount-plans/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    discountPlans,
    pending,
    error,
    refresh,
    saveDiscountPlan,
    deleteDiscountPlan
  }
}

