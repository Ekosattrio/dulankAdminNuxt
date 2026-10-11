import type { FaqItem, FaqFormData } from '#server/types/faq'

interface ResponseData {
  success: boolean
  data: FaqItem[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: FaqItem
  message?: string
}

/**
 * FAQ — backend Laravel `/api/v1/admin/faqs`.
 */
export function useFaqs(filterParams?: Ref<{ search?: string; category?: string; status?: string }>) {
  const params = ref<{ search?: string; category?: string; status?: string }>(isRef(filterParams) ? filterParams.value : filterParams ?? {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    category: params.value.category || undefined,
    status: params.value.status || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/faqs', {
    key: 'faqs-list',
    query
  })

  const faqs = computed<FaqItem[]>(() => data.value?.data ?? [])

  const saveFaq = async (payload: FaqFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/faqs/${encodeURIComponent(id)}` : '/api/v1/admin/faqs',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteFaq = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/faqs/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  return {
    faqs,
    pending,
    error,
    refresh,
    saveFaq,
    deleteFaq
  }
}