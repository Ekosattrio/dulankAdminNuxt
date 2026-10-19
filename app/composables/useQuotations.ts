import type { Quotation, QuotationFormData, QuotationFilterParams } from '#server/types/quotation'

interface ResponseData {
  success: boolean
  data: Quotation[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: Quotation
  message?: string
}

/**
 * Quotation — backend Laravel `/api/v1/admin/quotations`.
 * Route mutasi memakai `{noQuotation}`; `id` di-resolve dari list.
 * Backend tidak menyediakan penghapusan dokumen quotation (mengikuti alur
 * bisnis: status Rejected/Ordered), sehingga `deleteQuotation` memberi
 * pesan yang jelas.
 */
export function useQuotations(filterParams?: Ref<QuotationFilterParams> | QuotationFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/quotations', {
    key: 'quotations-list',
    query
  })

  const quotations = computed<Quotation[]>(() => data.value?.data ?? [])

  const resolveNo = (idOrNo: string): string => {
    return quotations.value.find(quotation => quotation.id === idOrNo || quotation.noQuotation === idOrNo)
      ?.noQuotation ?? idOrNo
  }

  const saveQuotation = async (payload: QuotationFormData) => {
    const { id, noQuotation, total, ...body } = payload
    void noQuotation
    void total

    const res = await apiFetch<MutationResponse>(
      id
        ? `/api/v1/admin/quotations/${encodeURIComponent(resolveNo(id))}`
        : '/api/v1/admin/quotations',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteQuotation = async (_id: string) => {
    void _id

    throw new Error('Penghapusan quotation tidak didukung; ubah status menjadi Rejected.')
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