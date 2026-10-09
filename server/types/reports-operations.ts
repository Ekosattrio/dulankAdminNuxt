export interface ProductReportItem {
  id: string
  product: string
  sku?: string
  category: string
  totalOrder: number
  unit: string
  unitPrice?: number
  amount: number
  percentage: number
  date?: string
}

export interface ExpenseReportItem {
  id: string
  category: string
  totalExpense: number
  amount: number
  percentage: number
  paymentMethod?: string
  date?: string
}

export interface IncomeReportItem {
  id: string
  category: string
  totalIncome: number
  amount: number
  percentage: number
  paymentMethod?: string
  date?: string
}

export interface ProductReportSummary {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  topCategory: string
  averageOrderValue: number
}

export interface ExpenseReportSummary {
  totalCategories: number
  totalExpensesCount: number
  totalExpenseAmount: number
  topExpenseCategory: string
  averageExpensePerCategory: number
}

export interface IncomeReportSummary {
  totalCategories: number
  totalIncomesCount: number
  totalIncomeAmount: number
  topIncomeCategory: string
  averageIncomePerCategory: number
}

export interface ProductReportFilterParams {
  search?: string
  category?: string
  startDate?: string
  endDate?: string
}

export interface ExpenseReportFilterParams {
  search?: string
  category?: string
  paymentMethod?: string
  startDate?: string
  endDate?: string
}

export interface IncomeReportFilterParams {
  search?: string
  category?: string
  paymentMethod?: string
  startDate?: string
  endDate?: string
}
