import type { ContactFormItem, ContactFormStats, ContactFormFilterQuery } from '#server/types/contact-form'

interface ResponseData {
  success: boolean
  data: ContactFormItem[]
  stats?: ContactFormStats
  message?: string
}

export function useContactForms(filterParams?: Ref<ContactFormFilterQuery> | ContactFormFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/webstore/contact-forms', {
    key: 'webstore-contact-forms-list',
    query: params
  })

  const contacts = computed<ContactFormItem[]>(() => data.value?.data ?? [])

  const { data: statsData, refresh: refreshStats } = useApiFetch<{ success: boolean; data: ContactFormStats }>(
    '/api/v1/admin/webstore/contact-forms/stats',
    { key: 'webstore-contact-forms-stats' }
  )

  const stats = computed<ContactFormStats>(() => statsData.value?.data ?? {
    totalContact: 0
  })

  const submitContact = async (_payload: Partial<ContactFormItem>) => {
    void _payload

    throw new Error('Form kontak dikirim oleh pengunjung webstore; admin hanya memoderasi pesan.')
  }

  const deleteContact = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/v1/admin/webstore/contact-forms/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    contacts,
    stats,
    pending,
    error,
    refresh,
    submitContact,
    deleteContact
  }
}
