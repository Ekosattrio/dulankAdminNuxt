import type { Coupon, CouponFormData } from '#server/types/promo'

export function useCoupons(filterParams?: Ref<{ search?: string; type?: string; status?: string } | undefined>) {
  const { data: response, pending, error, refresh } = useApiFetch<{ success: boolean; data: Coupon[]; message?: string }>('/api/coupons', {
    key: 'coupons-data',
    query: filterParams,
    lazy: false
  })

  const coupons = computed<Coupon[]>(() => response.value?.data || [])

  async function saveCoupon(payload: CouponFormData) {
    const res = await apiFetch<{ success: boolean; data: Coupon; message?: string }>('/api/coupons', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  async function deleteCoupon(id: string | number) {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/coupons/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    coupons,
    pending,
    error,
    refresh,
    saveCoupon,
    deleteCoupon
  }
}

