import type { SalesContact } from '#server/types/sales-document'
export function useSalesContacts() {
  const { data, refresh } = useApiFetch<{ success: boolean; data: SalesContact[] }>(
    '/api/sales/contacts',
    {
      key: 'sales-contacts',
    },
  )
  const contacts = computed(() => data.value?.data ?? [])
  async function createContact(contact: SalesContact) {
    const result = await apiFetch<{ success: boolean; message?: string }>('/api/customers', {
      method: 'POST',
      body: { ...contact, type: 'General', channel: 'Website' },
    })
    await refresh()
    return result
  }
  return { contacts, refresh, createContact }
}
