import type { IncomeRecord, IncomeFormData, IncomeFilterParams } from '#server/types/income'

interface ResponseData {
  success: boolean
  data: IncomeRecord[]
  meta?: { page: number; limit: number; total: number }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: IncomeRecord
  message?: string
}

/**
 * Pendapatan — backend Laravel `/api/v1/admin/incomes`.
 */
export function useIncomes(filterParams?: Ref<IncomeFilterParams> | IncomeFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    category: params.value.category || undefined,
    limit: 100
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/incomes', {
    key: 'incomes-list',
    query
  })

  const incomes = computed<IncomeRecord[]>(() => data.value?.data ?? [])

  const saveIncome = async (payload: IncomeFormData) => {
    const { id, no, isCancelled, bankAccount, ...body } = payload
    void no
    void isCancelled
    void bankAccount

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/incomes/${encodeURIComponent(id)}` : '/api/v1/admin/incomes',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteIncome = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/incomes/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

    await refresh()
    return res
  }

  return {
    incomes,
    pending,
    error,
    refresh,
    saveIncome,
    deleteIncome
  }
}