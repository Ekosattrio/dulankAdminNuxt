import type { SalesContact } from '#server/types/sales-document'
export function useSalesContacts() {
  const { data: people } = useApiFetch<{ customer: SalesContact[] }>('/assets/json/customer.json', {
    key: 'sales-contact-source',
  })
  const { data: companies } = useApiFetch<{ company: SalesContact[] }>('/assets/json/company.json', {
    key: 'sales-company-source',
  })
  const { data: saved, refresh } = useApiFetch<{ data: SalesContact[] }>('/api/customers', {
    key: 'sales-contact-saved',
  })
  const contacts = computed(() => [
    ...new Map(
      [
        ...(people.value?.customer ?? []),
        ...(companies.value?.company ?? []),
        ...(saved.value?.data ?? []),
      ].map((c) => [c.name, { ...c, address: c.address || '' }]),
    ).values(),
  ])
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
