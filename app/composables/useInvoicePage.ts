import type { Invoice, InvoiceFormData } from '#server/types/invoice'

export function useInvoicePage() {
  const { invoices, pending, error, refresh, saveInvoice, deleteInvoice } = useInvoices()
  const actions = useSalesListActions<Invoice, InvoiceFormData>(saveInvoice, deleteInvoice)
  const searchQuery = ref('')
  const filterStatus = ref('')

  const filteredList = computed(() =>
    invoices.value.filter((item) => {
      const query = searchQuery.value.trim().toLowerCase()
      return (
        (!query ||
          Object.values(item).some((value) =>
            String(value ?? '')
              .toLowerCase()
              .includes(query),
          )) &&
        (!filterStatus.value || item.status === filterStatus.value)
      )
    }),
  )
  function handleDelete(id: string) {
    actions.actionError.value = ''
    actions.deleting.value = invoices.value.find((item) => item.id === id) ?? null
  }
  function printTable() {
    const keys: (keyof Invoice)[] = [
      'invoiceNo',
      'customer',
      'dueDate',
      'amount',
      'paid',
      'amountDue',
      'status',
    ]
    printSalesRows(
      'Invoice',
      ['invoiceNo', 'customer', 'dueDate', 'amount', 'paid', 'amountDue', 'status'],
      filteredList.value.map((item) => keys.map((key) => item[key])),
    )
  }
  return {
    ...actions,
    invoices,
    pending,
    error,
    refresh,
    searchQuery,
    filterStatus,
    filteredList,
    handleDelete,
    printTable,
  }
}
