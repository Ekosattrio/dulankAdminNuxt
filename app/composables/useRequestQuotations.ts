import type { RFQItem } from '#server/types/request-quotation'
import type { SalesContact } from '#server/types/sales-document'

export function useRequestQuotations() {
  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: RFQItem[] }>(
    '/api/request-quotations' as string,
    { key: 'request-quotations-list' },
  )
  const rfqs = computed<RFQItem[]>(() => data.value?.data ?? [])
  const statusFilter = ref('All')
  const filteredRFQs = computed(() =>
    rfqs.value.filter((item) => statusFilter.value === 'All' || item.status === statusFilter.value),
  )
  const save = async (body: Partial<RFQItem>) => {
    await apiFetch('/api/request-quotations', { method: 'POST', body })
    await refresh()
  }
  const remove = async (id: string) => {
    await apiFetch(`/api/request-quotations/${id}`, { method: 'DELETE' })
    await refresh()
  }
  const actions = useSalesListActions<RFQItem, Partial<RFQItem>>(save, remove)
  const duplicating = ref<RFQItem | null>(null)
  function duplicateRFQ(item: RFQItem) {
    actions.actionError.value = ''
    duplicating.value = item
  }
  async function confirmDuplicate(contact: SalesContact) {
    const item = duplicating.value
    if (!item || !contact.name.trim()) return
    if (actions.busy.value) return
    actions.busy.value = true
    actions.actionError.value = ''
    try {
      await save({
        ...item,
        id: undefined,
        noRequest: undefined,
        date: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        customer: contact.name,
        email: contact.email,
        telp: contact.phone,
        document: item.document
          ? {
              ...JSON.parse(JSON.stringify(item.document)),
              to: contact.name,
              email: contact.email,
              telp: contact.phone,
            }
          : undefined,
      })
      duplicating.value = null
      actions.toastMessage.value = 'Request quotation duplicated.'
    } catch (error) {
      actions.actionError.value = salesErrorMessage(error)
    } finally {
      actions.busy.value = false
    }
  }
  function printTable() {
    printSalesRows(
      'Request Quotation List',
      ['No Request', 'Customer', 'Email', 'Telp', 'Date', 'Status'],
      filteredRFQs.value.map((item) => [
        item.noRequest,
        item.customer,
        item.email,
        item.telp,
        item.date,
        item.status,
      ]),
    )
  }
  return {
    ...actions,
    rfqs,
    pending,
    error,
    refresh,
    statusFilter,
    filteredRFQs,
    duplicateRFQ,
    duplicating,
    confirmDuplicate,
    printTable,
  }
}
