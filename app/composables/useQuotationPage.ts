import type { Quotation, QuotationFormData } from '#server/types/quotation'

export function useQuotationPage() {
  const { quotations, pending, error, refresh, saveQuotation, deleteQuotation } = useQuotations()
  const actions = useSalesListActions<Quotation, QuotationFormData>(saveQuotation, deleteQuotation)
  const searchQuery = ref('')
  const filterStatus = ref('')

  const filteredList = computed(() =>
    quotations.value.filter((item) => {
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
    actions.deleting.value = quotations.value.find((item) => item.id === id) ?? null
  }
  function printTable() {
    const keys: (keyof Quotation)[] = [
      'noQuotation',
      'date',
      'customer',
      'email',
      'status',
      'dateStatus',
      'total',
      'channel',
      'dueDate',
    ]
    printSalesRows(
      'Quotation List',
      ['noQuotation', 'date', 'customer', 'email', 'status', 'dateStatus', 'total', 'channel', 'dueDate'],
      filteredList.value.map((item) => keys.map((key) => item[key])),
    )
  }
  return {
    ...actions,
    quotations,
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
