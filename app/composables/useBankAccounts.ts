import type {
  BankAccountFormData,
  BankAccountTypeFormData,
  BankAccountTypeView,
  BankAccountView,
} from '#server/types/bank-account'

interface AccountResponse {
  success: boolean
  data: BankAccountView[]
  meta: {
    stats: { total: number; active: number; inactive: number; totalBalance: number }
  }
}

interface TypeResponse {
  success: boolean
  data: BankAccountTypeView[]
}

export function useBankAccounts() {
  const accountsRequest = useApiFetch<AccountResponse>('/api/bank-accounts', { key: 'bank-account-list' })
  const typesRequest = useApiFetch<TypeResponse>('/api/bank-account-types', { key: 'bank-account-type-list' })

  const accounts = computed<BankAccountView[]>(() => accountsRequest.data.value?.data ?? [])
  const accountTypes = computed<BankAccountTypeView[]>(() => typesRequest.data.value?.data ?? [])
  const stats = computed(() => accountsRequest.data.value?.meta.stats ?? {
    total: 0,
    active: 0,
    inactive: 0,
    totalBalance: 0,
  })
  const pending = computed(() => accountsRequest.pending.value || typesRequest.pending.value)
  const error = computed(() => accountsRequest.error.value || typesRequest.error.value)

  async function refresh() {
    await Promise.all([accountsRequest.refresh(), typesRequest.refresh()])
  }

  async function saveAccount(payload: BankAccountFormData) {
    const response = await apiFetch<{ success: boolean; data: BankAccountView; message: string }>('/api/bank-accounts', {
      method: 'POST',
      body: payload,
    })
    await refresh()
    return response
  }

  async function removeAccount(id: string) {
    const response = await apiFetch<{ success: boolean; message: string }>(`/api/bank-accounts/${id}`, {
      method: 'DELETE',
    })
    await refresh()
    return response
  }

  async function saveAccountType(payload: BankAccountTypeFormData) {
    const response = await apiFetch<{ success: boolean; data: BankAccountTypeView; message: string }>(
      '/api/bank-account-types',
      { method: 'POST', body: payload },
    )
    await refresh()
    return response
  }

  async function removeAccountType(id: string) {
    const response = await apiFetch<{ success: boolean; message: string }>(`/api/bank-account-types/${id}`, {
      method: 'DELETE',
    })
    await refresh()
    return response
  }

  return {
    accounts,
    accountTypes,
    stats,
    pending,
    error,
    refresh,
    saveAccount,
    removeAccount,
    saveAccountType,
    removeAccountType,
  }
}

