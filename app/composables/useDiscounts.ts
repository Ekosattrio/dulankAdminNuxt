import type { DiscountItem, DiscountFormData, DiscountQuery } from '#server/types/discount'

interface ResponseData {
  success: boolean
  data: DiscountItem[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: DiscountItem
  message?: string
}

/**
 * Diskon — backend Laravel `/api/v1/admin/discounts` (CRUD penuh).
 */
export function useDiscounts(filterParams?: Ref<DiscountQuery> | DiscountQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    plan: params.value.plan || undefined,
    status: params.value.status || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/discounts', {
    key: 'discounts-list',
    query
  })

  const discounts = computed<DiscountItem[]>(() => data.value?.data ?? [])

  const saveDiscount = async (payload: DiscountFormData) => {
    const { id, plan, ...body } = payload
    void plan

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/discounts/${encodeURIComponent(id)}` : '/api/v1/admin/discounts',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteDiscount = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/discounts/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

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