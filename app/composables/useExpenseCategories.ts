import type { ExpenseCategory, ExpenseCategoryFormData, ExpenseCategoryFilterParams } from '#server/types/expense-category'

interface ResponseData {
  success: boolean
  data: ExpenseCategory[]
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: ExpenseCategory
  message?: string
}

/**
 * Kategori pengeluaran — backend Laravel `/api/v1/admin/expense-categories`.
 * Backend menerima alias `categoryName` (identik dengan nama kategori).
 */
export function useExpenseCategories(filterParams?: Ref<ExpenseCategoryFilterParams> | ExpenseCategoryFilterParams) {
  const params = isRef(filterParams) ? filterParams : ref(filterParams || {})

  const query = computed(() => ({
    search: params.value.search || undefined,
    status: params.value.status || undefined
  }))

  const { data, pending, error, refresh } = useApiFetch<ResponseData>('/api/v1/admin/expense-categories', {
    key: 'expense-categories-list',
    query
  })

  const expenseCategories = computed<ExpenseCategory[]>(() => data.value?.data ?? [])

  const saveExpenseCategory = async (payload: ExpenseCategoryFormData) => {
    const { id, ...body } = payload

    const res = await apiFetch<MutationResponse>(
      id ? `/api/v1/admin/expense-categories/${encodeURIComponent(id)}` : '/api/v1/admin/expense-categories',
      {
        method: id ? 'PUT' : 'POST',
        body
      }
    )

    await refresh()
    return res
  }

  const deleteExpenseCategory = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(
      `/api/v1/admin/expense-categories/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    )

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