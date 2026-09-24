import type { Expense, ExpenseFormData, ExpenseFilterParams } from '#server/types/expense'

interface ResponseData {
  success: boolean
  data: Expense[]
  message?: string
}

export function useExpenses(filterParams?: Ref<ExpenseFilterParams> | ExpenseFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/expenses', {
    key: 'expenses-list',
    query: params
  })

  const expenses = computed<Expense[]>(() => data.value?.data ?? [])

  const saveExpense = async (payload: ExpenseFormData) => {
    const res = await $fetch<{ success: boolean; data: Expense; message?: string }>('/api/expenses', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteExpense = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/expenses/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    expenses,
    pending,
    error,
    refresh,
    saveExpense,
    deleteExpense
  }
}
