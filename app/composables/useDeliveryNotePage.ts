import type { DeliveryNote, DeliveryNoteFormData } from '#server/types/delivery-note'

export function useDeliveryNotePage() {
  const { deliveryNotes, pending, error, refresh, saveDeliveryNote, deleteDeliveryNote } = useDeliveryNotes()
  const actions = useSalesListActions<DeliveryNote, DeliveryNoteFormData>(
    saveDeliveryNote,
    deleteDeliveryNote,
  )
  const searchQuery = ref('')
  const filterStatus = ref('')

  const filteredList = computed(() =>
    deliveryNotes.value.filter((item) => {
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
    actions.deleting.value = deliveryNotes.value.find((item) => item.id === id) ?? null
  }
  function printTable() {
    const keys: (keyof DeliveryNote)[] = [
      'dnNo',
      'date',
      'customer',
      'noSales',
      'shippingAddress',
      'status',
      'dateStatus',
    ]
    printSalesRows(
      'Delivery Note',
      ['dnNo', 'date', 'customer', 'noSales', 'shippingAddress', 'status', 'dateStatus'],
      filteredList.value.map((item) => keys.map((key) => item[key])),
    )
  }
  return {
    ...actions,
    deliveryNotes,
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
