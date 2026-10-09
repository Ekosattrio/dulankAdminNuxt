import type { IncomeRecord, IncomeFormData, IncomeFilterParams } from '#server/types/income'

interface ResponseData {
  success: boolean
  data: IncomeRecord[]
  message?: string
}

export function useIncomes(filterParams?: Ref<IncomeFilterParams> | IncomeFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/incomes', {
    key: 'incomes-list',
    query: params
  })

  const incomes = computed<IncomeRecord[]>(() => data.value?.data ?? [])

  const saveIncome = async (payload: IncomeFormData) => {
    const res = await apiFetch<{ success: boolean; data: IncomeRecord; message?: string }>('/api/incomes', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteIncome = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/incomes/${id}`, {
      method: 'DELETE'
    })
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
