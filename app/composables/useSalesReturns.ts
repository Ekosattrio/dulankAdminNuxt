import type { SalesReturn, SalesReturnFormData, ReturnPayment } from '#server/types/sales-return'

const RELIST = '/api/v1/admin/sales-returns'

/**
 * Sales Return — backend Laravel `/api/v1/admin/sales-returns`.
 * Route mutasi memakai `{returnNo}` (bukan id); komposabel menyelesaikan
 * `id` → `returnNo` dari list yang sudah dimuat.
 */
export function useSalesReturns() {
  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: SalesReturn[] }>(RELIST, {
    key: 'sales-returns-list',
    query: { limit: 100 },
  })
  const returns = computed<SalesReturn[]>(() => data.value?.data ?? [])
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

  const byReturnNo = (idOrNo: number | string): string => {
    const found = returns.value.find(item => item.id === Number(idOrNo) || item.returnNo === String(idOrNo))

    return found?.returnNo ?? String(idOrNo)
  }

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
  async function mutate(action: () => Promise<unknown>, done?: () => void) {
    busy.value = true
    actionError.value = ''
    try {
      await action()
      await refresh()
      done?.()
      message.value = 'Changes saved successfully.'
    } catch (error) {
      actionError.value = salesErrorMessage(error)
    } finally {
      busy.value = false
    }
  }
  function save(body: SalesReturnFormData) {
    const { id, paymentStatus, payment, total, ...form } = body
    void id
    void paymentStatus
    void payment
    void total

    return mutate(
      () => apiFetch<unknown>(RELIST, { method: 'POST', body: form }),
      () => {
        editorOpen.value = false
      },
    )
  }
  function pay(body: ReturnPayment) {
    if (!paymentReturn.value) return
    return mutate(
      () =>
        apiFetch<unknown>(
          `${RELIST}/${encodeURIComponent(byReturnNo(paymentReturn.value!.id))}/refund`,
          {
            method: 'POST',
            body: {
              method: body.method,
              amount: body.amount,
              reference: body.reference ?? body.notes,
              notes: body.notes,
            },
          },
        ),
      () => {
        paymentReturn.value = null
      },
    )
  }
  function remove() {
    if (!deleting.value) return
    return mutate(
      () =>
        apiFetch<unknown>(`${RELIST}/${encodeURIComponent(byReturnNo(deleting.value!.id))}`, {
          method: 'DELETE',
        }),
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