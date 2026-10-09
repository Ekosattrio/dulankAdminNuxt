export interface ExpenseCategory {
  id: string
  categoryName: string
  description: string
  date: string
  status: 'Active' | 'Deactive'
}

export interface ExpenseCategoryFilterParams {
  search?: string
  status?: string
}

export interface ExpenseCategoryFormData {
  id?: string
  categoryName: string
  description: string
  date?: string
  status: 'Active' | 'Deactive'
}

