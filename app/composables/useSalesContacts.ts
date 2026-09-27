import type { SalesContact } from '#server/types/sales-document'
export function useSalesContacts() {
  const { data: people } = useFetch<{ customer: SalesContact[] }>('/assets/json/customer.json', {
    key: 'sales-contact-source',
  })
  const { data: companies } = useFetch<{ company: SalesContact[] }>('/assets/json/company.json', {
    key: 'sales-company-source',
  })
  const { data: saved, refresh } = useFetch<{ data: SalesContact[] }>('/api/customers', {
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
  return { contacts, refresh }
}
