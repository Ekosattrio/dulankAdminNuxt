import type { Variant, VariantFormData, VariantFilterParams } from '#server/types/variant'

interface ResponseData {
  success: boolean
  data: Variant[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: Variant
  message?: string
}

/**
 * Varian produk — backend Laravel `/api/v1/admin/variants`.
 */
export function useVariants(filterParams?: Ref<VariantFilterParams> | VariantFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/variants', {
    key: 'variants-list',
    query
  })

  const variants = computed<Variant[]>(() => data.value?.data ?? [])

  const saveVariant = async (payload: VariantFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/variants/${encodeURIComponent(id)}` : '/api/v1/admin/variants',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteVariant = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/variants/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  return {
    variants,
    pending,
    error,
    refresh,
    saveVariant,
    deleteVariant
  }
}