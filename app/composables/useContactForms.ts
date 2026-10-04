import type { ContactFormItem, ContactFormStats, ContactFormFilterQuery } from '#server/types/contact-form'

interface ResponseData {
  success: boolean
  data: ContactFormItem[]
  stats?: ContactFormStats
  message?: string
}

export function useContactForms(filterParams?: Ref<ContactFormFilterQuery> | ContactFormFilterQuery) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/webstore/contact-forms', {
    key: 'webstore-contact-forms-list',
    query: params
  })

  const contacts = computed<ContactFormItem[]>(() => data.value?.data ?? [])
  const stats = computed<ContactFormStats>(() => data.value?.stats ?? {
    totalContact: 0
  })

  const submitContact = async (payload: Partial<ContactFormItem>) => {
    const res = await $fetch<{ success: boolean; data: ContactFormItem; message?: string }>('/api/webstore/contact-forms', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteContact = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/webstore/contact-forms/${id}`, {
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
