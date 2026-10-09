import type { Sale, SaleFormData } from '#server/types/sale'

export function useSalesPage() {
  const { sales, pending, error, refresh, saveSale, deleteSale } = useSales()
  const actions = useSalesListActions<Sale, SaleFormData>(saveSale, deleteSale)
  const searchQuery = ref('')
  const filterStatus = ref('')
  const filterChannel = ref('')
  const filterTransactionCode = ref('')
  const filteredList = computed(() =>
    sales.value.filter((item) => {
      const query = searchQuery.value.trim().toLowerCase()
      return (
        (!query ||
          Object.values(item).some((value) =>
            String(value ?? '')
              .toLowerCase()
              .includes(query),
          )) &&
        (!filterStatus.value || item.status === filterStatus.value) &&
        (!filterChannel.value || item.channel === filterChannel.value) &&
        (!filterTransactionCode.value || item.transactionCode === filterTransactionCode.value)
      )
    }),
  )
  function handleDelete(id: string) {
    actions.actionError.value = ''
    actions.deleting.value = sales.value.find((item) => item.id === id) ?? null
  }
  function printTable() {
    const keys: (keyof Sale)[] = [
      'saleNo',
      'customer',
      'date',
      'subTotal',
      'deliveryFee',
      'discount',
      'tax',
      'total',
      'delivery',
      'channel',
      'status',
      'method',
    ]
    printSalesRows(
      'Sales',
      [
        'saleNo',
        'customer',
        'date',
        'subTotal',
        'deliveryFee',
        'discount',
        'tax',
        'total',
        'delivery',
        'channel',
        'status',
        'method',
      ],
      filteredList.value.map((item) => keys.map((key) => item[key])),
    )
  }
  return {
    ...actions,
    sales,
    pending,
    error,
    refresh,
    searchQuery,
    filterStatus,
    filterChannel,
    filterTransactionCode,
    filteredList,
    handleDelete,
    printTable,
  }
}
