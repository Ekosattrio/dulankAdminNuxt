import type { SalesReturn, SalesReturnFormData, ReturnPayment } from '#server/types/sales-return'

export function useSalesReturns() {
  const { data, pending, error, refresh } = useFetch<{ success: boolean; data: SalesReturn[] }>(
    '/api/sales-returns',
    { key: 'sales-returns-list' },
  )
  const returns = computed(() => data.value?.data ?? [])
  const searchQuery = ref('')
  const filterPaymentStatus = ref('')
  const filteredReturns = computed(() =>
    returns.value.filter(
      (item) =>
        `${item.returnNo} ${item.salesNo} ${item.customer}`
          .toLowerCase()
          .includes(searchQuery.value.trim().toLowerCase()) &&
        (!filterPaymentStatus.value || item.paymentStatus === filterPaymentStatus.value),
    ),
  )
  const editorOpen = ref(false)
  const editData = ref<SalesReturn | null>(null)
  const selectedReturn = ref<SalesReturn | null>(null)
  const paymentReturn = ref<SalesReturn | null>(null)
  const deleting = ref<SalesReturn | null>(null)
  const busy = ref(false)
  const actionError = ref('')
  const message = ref('')
  function add() {
    editData.value = null
    actionError.value = ''
    editorOpen.value = true
  }
  function edit(item: SalesReturn) {
    editData.value = item
    actionError.value = ''
    editorOpen.value = true
  }
  async function mutate(action: () => Promise<unknown>, done: () => void) {
    if (busy.value) return
    busy.value = true
    actionError.value = ''
    try {
      await action()
      await refresh()
      done()
      message.value = 'Changes saved successfully.'
    } catch (error) {
      actionError.value = salesErrorMessage(error)
    } finally {
      busy.value = false
    }
  }
  function save(body: SalesReturnFormData) {
    return mutate(
      () => $fetch<unknown>('/api/sales-returns', { method: 'POST', body }),
      () => {
        editorOpen.value = false
      },
    )
  }
  function pay(body: ReturnPayment) {
    if (!paymentReturn.value) return
    return mutate(
      () =>
        $fetch<unknown>(`/api/sales-returns/${paymentReturn.value!.id}/payment`, { method: 'POST', body }),
      () => {
        paymentReturn.value = null
      },
    )
  }
  function remove() {
    if (!deleting.value) return
    return mutate(
      () => $fetch<unknown>(`/api/sales-returns/${deleting.value!.id}`, { method: 'DELETE' }),
      () => {
        deleting.value = null
      },
    )
  }
  function printTable() {
    printSalesRows(
      'Sales Return List',
      [
        'No Return',
        'Date',
        'No Sales',
        'Customer',
        'Payment Status',
        'Payment Date',
        'Payment Method',
        'Total',
      ],
      filteredReturns.value.map((item) => [
        item.returnNo,
        item.date,
        item.salesNo,
        item.customer,
        item.paymentStatus,
        item.paymentDate,
        item.paymentMethod,
        item.total,
      ]),
    )
  }
  return {
    pending,
    error,
    refresh,
    filteredReturns,
    searchQuery,
    filterPaymentStatus,
    editorOpen,
    editData,
    selectedReturn,
    paymentReturn,
    deleting,
    busy,
    actionError,
    message,
    add,
    edit,
    save,
    pay,
    remove,
    printTable,
  }
}
