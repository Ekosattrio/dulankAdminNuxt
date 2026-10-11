import type {
  BankAccountFormData,
  BankAccountTypeFormData,
  BankAccountTypeView,
  BankAccountView,
} from '#server/types/bank-account'

interface AccountResponse {
  success: boolean
  data: BankAccountView[]
  meta?: {
    stats: { total: number; active: number; inactive: number; totalBalance: number }
  }
}

interface TypeResponse {
  success: boolean
  data: BankAccountTypeView[]
}

interface MutationResponse {
  success: boolean
  data?: BankAccountView | BankAccountTypeView
  message: string
}

/**
 * Rekening bank + tipe rekening — backend Laravel
 * `/api/v1/admin/bank-accounts` dan `/bank-account-types`.
 */
export function useBankAccounts() {
  const accountsRequest = useApiFetch<AccountResponse>('/api/v1/admin/bank-accounts', {
    key: 'bank-account-list',
    query: { limit: 100 },
  })
  const typesRequest = useApiFetch<TypeResponse>('/api/v1/admin/bank-account-types', {
    key: 'bank-account-type-list',
  })

  const accounts = computed<BankAccountView[]>(() => accountsRequest.data.value?.data ?? [])
  const accountTypes = computed<BankAccountTypeView[]>(() => typesRequest.data.value?.data ?? [])
  const stats = computed(() => accountsRequest.data.value?.meta?.stats ?? {
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
    const { id, ...body } = payload

    const response = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/bank-accounts/${encodeURIComponent(id)}` : '/api/v1/admin/bank-accounts',
      {
        method: id ? 'PUT' : 'POST',
        body,
      },
    )
    await refresh()
    return response
  }

  async function removeAccount(id: string) {
    const response = await apiFetch<{ success: boolean; message: string }>(
      `/api/v1/admin/bank-accounts/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    )
    await refresh()
    return response
  }

  async function saveAccountType(payload: BankAccountTypeFormData) {
    const { id, ...body } = payload

    const response = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/bank-account-types/${encodeURIComponent(id)}` : '/api/v1/admin/bank-account-types',
      {
        method: id ? 'PUT' : 'POST',
        body,
      },
    )
    await refresh()
    return response
  }

  async function removeAccountType(id: string) {
    const response = await apiFetch<{ success: boolean; message: string }>(
      `/api/v1/admin/bank-account-types/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    )
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
    removeAccountType
  }
}