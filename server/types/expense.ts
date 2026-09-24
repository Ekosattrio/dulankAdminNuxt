export interface Expense {
  id: string
  noExpense: string
  date: string
  category: string
  name: string
  status: 'Paid' | 'Unpaid' | 'Partial' | 'Canceled'
  amount: number
  paid: number
  due: number
  description: string
}

export interface ExpenseFilterParams {
  search?: string
  status?: string
  category?: string
  dateRange?: string
}

export interface ExpenseFormData {
  id?: string
  noExpense?: string
  date: string
  category: string
  name: string
  status: 'Paid' | 'Unpaid' | 'Partial' | 'Canceled'
  amount: number
  paid: number
  due?: number
  description: string
}

