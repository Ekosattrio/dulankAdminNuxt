import type { MoneyTransferFormData, MoneyTransferView } from '#server/types/money-transfer'
import type { BankAccountView } from '#server/types/bank-account'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useBankAccounts } from './useBankAccounts'
import { isDateInRange } from '~/composables/useDateRange'
import { useMoneyTransfers } from './useMoneyTransfers'
import { salesErrorMessage } from '~/utils/salesDocuments'

export function useMoneyTransferManager() {
  const transferDomain = useMoneyTransfers()
  const bankDomain = useBankAccounts()
  const search = ref('')
  const dateRange = ref<DateRangeValue | null>(null)
  const currentPageItems = ref<MoneyTransferView[]>([])
  const formTarget = ref<MoneyTransferView | null>(null)
  const detailTarget = ref<MoneyTransferView | null>(null)
  const deleteTarget = ref<MoneyTransferView | null>(null)
  const formOpen = ref(false)
  const busy = ref(false)
  const mutationError = ref('')
  const message = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  const accounts = computed<BankAccountView[]>(() => bankDomain.accounts.value.filter((account: BankAccountView) => account.status === 'Active'))
  const items = computed<MoneyTransferView[]>(() => {
    const query = search.value.trim().toLowerCase()
    return transferDomain.transfers.value.filter((item: MoneyTransferView) => {
      if (!isDateInRange(item.occurredAt.slice(0, 10), dateRange.value)) return false
      return !query || [item.no, item.fromAccount, item.toAccount, item.description, item.createdBy]
        .some((value) => value.toLowerCase().includes(query))
    })
  })
  const pending = computed(() => transferDomain.pending.value || bankDomain.pending.value)
  const error = computed(() => transferDomain.error.value || bankDomain.error.value)

  function notify(value: string) {
    message.value = value
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { message.value = '' }, 3500)
  }
  function openForm(item: MoneyTransferView | null = null) {
    mutationError.value = ''
    formTarget.value = item
    formOpen.value = true
  }
  async function save(payload: MoneyTransferFormData) {
    busy.value = true
    mutationError.value = ''
    try {
      const result = await transferDomain.saveTransfer(payload)
      await bankDomain.refresh()
      formOpen.value = false
      notify(result.message)
    } catch (error) {
      mutationError.value = salesErrorMessage(error)
    } finally {
      busy.value = false
    }
  }
  async function remove() {
    if (!deleteTarget.value) return
    busy.value = true
    mutationError.value = ''
    try {
      const result = await transferDomain.deleteTransfer(deleteTarget.value.id)
      await bankDomain.refresh()
      deleteTarget.value = null
      notify(result.message)
    } catch (error) {
      mutationError.value = salesErrorMessage(error)
    } finally {
      busy.value = false
    }
  }
  async function refresh() {
    search.value = ''
    dateRange.value = null
    await Promise.all([transferDomain.refresh(), bankDomain.refresh()])
  }
  onScopeDispose(() => { if (timer) clearTimeout(timer) })

  return {
    search, dateRange, currentPageItems, formTarget, detailTarget, deleteTarget, formOpen,
    busy, mutationError, message, accounts, items, pending, error, openForm, save, remove, refresh,
  }
}

