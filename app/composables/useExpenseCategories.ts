import type { ExpenseCategory, ExpenseCategoryFormData, ExpenseCategoryFilterParams } from '#server/types/expense-category'

interface ResponseData {
  success: boolean
  data: ExpenseCategory[]
  message?: string
}

export function useExpenseCategories(filterParams?: Ref<ExpenseCategoryFilterParams> | ExpenseCategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const { data, pending, error, refresh } = useFetch<ResponseData>('/api/expense-categories', {
    key: 'expense-categories-list',
    query: params
  })

  const expenseCategories = computed<ExpenseCategory[]>(() => data.value?.data ?? [])

  const saveExpenseCategory = async (payload: ExpenseCategoryFormData) => {
    const res = await $fetch<{ success: boolean; data: ExpenseCategory; message?: string }>('/api/expense-categories', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteExpenseCategory = async (id: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(`/api/expense-categories/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    expenseCategories,
    pending,
    error,
    refresh,
    saveExpenseCategory,
    deleteExpenseCategory
  }
}
