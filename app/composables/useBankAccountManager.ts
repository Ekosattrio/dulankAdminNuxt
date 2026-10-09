import type {
  BankAccountFormData,
  BankAccountTypeFormData,
  BankAccountTypeView,
  BankAccountView,
} from '#server/types/bank-account'
import { useBankAccounts } from './useBankAccounts'
import { salesErrorMessage } from '~/utils/salesDocuments'

export function useBankAccountManager() {
  const domain = useBankAccounts()
  const activeTab = ref<'accounts' | 'types'>('accounts')
  const search = ref('')
  const status = ref('')
  const accountTypeId = ref('')
  const currentPageAccounts = ref<BankAccountView[]>([])
  const currentPageTypes = ref<BankAccountTypeView[]>([])
  const accountFormTarget = ref<BankAccountView | null>(null)
  const typeFormTarget = ref<BankAccountTypeView | null>(null)
  const accountDeleteTarget = ref<BankAccountView | null>(null)
  const typeDeleteTarget = ref<BankAccountTypeView | null>(null)
  const accountFormOpen = ref(false)
  const typeFormOpen = ref(false)
  const busy = ref(false)
  const mutationError = ref('')
  const message = ref('')
  let messageTimer: ReturnType<typeof setTimeout> | undefined

  const filteredAccounts = computed(() => {
    const query = search.value.trim().toLowerCase()
    return domain.accounts.value.filter((item) => {
      if (status.value && item.status !== status.value) return false
      if (accountTypeId.value && item.accountTypeId !== accountTypeId.value) return false
      return !query || [item.accountName, item.bankName, item.accountNo, item.accountTypeName, item.ifsc]
        .some((value) => value.toLowerCase().includes(query))
    })
  })
  const filteredTypes = computed(() => {
    const query = search.value.trim().toLowerCase()
    return domain.accountTypes.value.filter((item) =>
      (!status.value || item.status === status.value) && (!query || item.name.toLowerCase().includes(query)),
    )
  })

  function notify(value: string) {
    message.value = value
    if (messageTimer) clearTimeout(messageTimer)
    messageTimer = setTimeout(() => { message.value = '' }, 3500)
  }
  function showAccountForm(item: BankAccountView | null = null) {
    mutationError.value = ''
    accountFormTarget.value = item
    accountFormOpen.value = true
  }
  function showTypeForm(item: BankAccountTypeView | null = null) {
    mutationError.value = ''
    typeFormTarget.value = item
    typeFormOpen.value = true
  }
  async function saveAccount(payload: BankAccountFormData) {
    busy.value = true
    mutationError.value = ''
    try {
      const result = await domain.saveAccount(payload)
      accountFormOpen.value = false
      notify(result.message)
    } catch (error) {
      mutationError.value = salesErrorMessage(error)
    } finally {
      busy.value = false
    }
  }
  async function saveType(payload: BankAccountTypeFormData) {
    busy.value = true
    mutationError.value = ''
    try {
      const result = await domain.saveAccountType(payload)
      typeFormOpen.value = false
      notify(result.message)
    } catch (error) {
      mutationError.value = salesErrorMessage(error)
    } finally {
      busy.value = false
    }
  }
  async function confirmDelete() {
    busy.value = true
    mutationError.value = ''
    try {
      const result = accountDeleteTarget.value
        ? await domain.removeAccount(accountDeleteTarget.value.id)
        : typeDeleteTarget.value
          ? await domain.removeAccountType(typeDeleteTarget.value.id)
          : null
      if (result) notify(result.message)
      accountDeleteTarget.value = null
      typeDeleteTarget.value = null
    } catch (error) {
      mutationError.value = salesErrorMessage(error)
    } finally {
      busy.value = false
    }
  }
  function resetFilters() {
    search.value = ''
    status.value = ''
    accountTypeId.value = ''
    return domain.refresh()
  }
  function closeDelete() {
    accountDeleteTarget.value = null
    typeDeleteTarget.value = null
    mutationError.value = ''
  }
  onScopeDispose(() => { if (messageTimer) clearTimeout(messageTimer) })

  return {
    ...domain,
    activeTab, search, status, accountTypeId, currentPageAccounts, currentPageTypes,
    filteredAccounts, filteredTypes, accountFormTarget, typeFormTarget,
    accountDeleteTarget, typeDeleteTarget, accountFormOpen, typeFormOpen,
    busy, mutationError, message, showAccountForm, showTypeForm, saveAccount, saveType,
    confirmDelete, resetFilters, closeDelete,
  }
}

