import type { FooterLinkItem, FooterLinkFormData } from '#server/types/footer'

interface ResponseData {
  success: boolean
  data: FooterLinkItem[]
  message?: string
}

export function useFooters() {
  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/footers', {
    key: 'footers-list'
  })

  const footers = computed<FooterLinkItem[]>(() => data.value?.data ?? [])

  const saveFooter = async (payload: FooterLinkFormData) => {
    const res = await $fetch<{ success: boolean; data: FooterLinkItem; message?: string }>('/api/footers', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteFooter = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/footers/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    footers,
    pending,
    error,
    refresh,
    saveFooter,
    deleteFooter
  }
}
