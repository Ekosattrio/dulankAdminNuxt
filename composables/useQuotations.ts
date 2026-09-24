import type { Quotation, QuotationFormData, QuotationFilterParams } from '#server/types/quotation'

interface ResponseData {
  success: boolean
  data: Quotation[]
  message?: string
}

export function useQuotations(filterParams?: Ref<QuotationFilterParams> | QuotationFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/quotations', {
    key: 'quotations-list',
    query: params
  })

  const quotations = computed<Quotation[]>(() => data.value?.data ?? [])

  const saveQuotation = async (payload: QuotationFormData) => {
    const res = await $fetch<{ success: boolean; data: Quotation; message?: string }>('/api/quotations', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteQuotation = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/quotations/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    quotations,
    pending,
    error,
    refresh,
    saveQuotation,
    deleteQuotation
  }
}
