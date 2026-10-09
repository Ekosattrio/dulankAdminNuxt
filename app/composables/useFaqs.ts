import type { FaqItem, FaqFormData } from '#server/types/faq'

interface ResponseData {
  success: boolean
  data: FaqItem[]
  message?: string
}

export function useFaqs() {
  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/faqs', {
    key: 'faqs-list'
  })

  const faqs = computed<FaqItem[]>(() => data.value?.data ?? [])

  const saveFaq = async (payload: FaqFormData) => {
    const res = await apiFetch<{ success: boolean; data: FaqItem; message?: string }>('/api/faqs', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteFaq = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/faqs/${id}`, {
      method: 'DELETE'
    })
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
