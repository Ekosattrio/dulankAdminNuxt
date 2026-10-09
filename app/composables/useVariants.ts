import type { Variant, VariantFormData, VariantFilterParams } from '#server/types/variant'

interface ResponseData {
  success: boolean
  data: Variant[]
  message?: string
}

export function useVariants(filterParams?: Ref<VariantFilterParams> | VariantFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/variants', {
    key: 'variants-list',
    query: params
  })

  const variants = computed<Variant[]>(() => data.value?.data ?? [])

  const saveVariant = async (payload: VariantFormData) => {
    const res = await apiFetch<{ success: boolean; data: Variant; message?: string }>('/api/variants', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteVariant = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/variants/${id}`, {
      method: 'DELETE'
    })
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
