import { ref, computed, isRef, type Ref } from 'vue'
import type {
  ProductReportItem,
  ProductReportSummary,
  ExpenseReportItem,
  ExpenseReportSummary,
  IncomeReportItem,
  IncomeReportSummary
} from '~/server/types/reports-operations'
import { isDateInRange, type DateRangeValue } from '~/composables/useDateRange'

interface ProductReportResponse {
  success: boolean
  data: ProductReportItem[]
  summary?: ProductReportSummary
  message?: string
}

interface ExpenseReportResponse {
  success: boolean
  data: ExpenseReportItem[]
  summary?: ExpenseReportSummary
  message?: string
}

interface IncomeReportResponse {
  success: boolean
  data: IncomeReportItem[]
  summary?: IncomeReportSummary
  message?: string
}

export interface UseProductReportOptions {
  search?: Ref<string> | string
  category?: Ref<string> | string
  dateRange?: Ref<DateRangeValue | null> | DateRangeValue | null
}

export function useProductReports(options: UseProductReportOptions = {}) {
  const searchQuery = isRef(options.search) ? options.search : ref(options.search || '')
  const categoryFilter = isRef(options.category) ? options.category : ref(options.category || '')
  const dateRange = isRef(options.dateRange) ? options.dateRange : ref(options.dateRange || null)

  const { data, pending, error, refresh } = useApiFetch<ProductReportResponse>('/api/reports/products', {
    key: 'reports-products',
    lazy: false
  })

  const rawItems = computed<ProductReportItem[]>(() => data.value?.data ?? [])

  const items = computed<ProductReportItem[]>(() => {
    let list = rawItems.value
    if (categoryFilter.value && categoryFilter.value !== 'All Categories' && categoryFilter.value !== 'All') {
      list = list.filter((item) => item.category?.toLowerCase() === categoryFilter.value.toLowerCase())
    }
    if (dateRange.value?.start || dateRange.value?.end) {
      list = list.filter((item) => isDateInRange(item.date || '', dateRange.value))
    }
    return list
  })

  const summary = computed<ProductReportSummary>(() => {
    const list = items.value
    const totalProducts = list.length
    const totalOrders = list.reduce((acc, cur) => acc + (Number(cur.totalOrder) || 0), 0)
    const totalRevenue = list.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      topCategory: list[0]?.category || '-',
      averageOrderValue: totalProducts > 0 ? Math.round(totalRevenue / totalProducts) : 0
    }
  })

  return {
    items,
    rawItems,
    searchQuery,
    categoryFilter,
    dateRange,
    summary,
    pending,
    error,
    refresh
  }
}

export interface UseExpenseReportOptions {
  search?: Ref<string> | string
  category?: Ref<string> | string
  paymentMethod?: Ref<string> | string
  dateRange?: Ref<DateRangeValue | null> | DateRangeValue | null
}

export function useExpenseReports(options: UseExpenseReportOptions = {}) {
  const searchQuery = isRef(options.search) ? options.search : ref(options.search || '')
  const categoryFilter = isRef(options.category) ? options.category : ref(options.category || '')
  const paymentMethodFilter = isRef(options.paymentMethod) ? options.paymentMethod : ref(options.paymentMethod || '')
  const dateRange = isRef(options.dateRange) ? options.dateRange : ref(options.dateRange || null)

  const { data, pending, error, refresh } = useApiFetch<ExpenseReportResponse>('/api/reports/expenses', {
    key: 'reports-expenses',
    lazy: false
  })

  const rawItems = computed<ExpenseReportItem[]>(() => data.value?.data ?? [])

  const items = computed<ExpenseReportItem[]>(() => {
    let list = rawItems.value
    if (categoryFilter.value && categoryFilter.value !== 'All Categories' && categoryFilter.value !== 'All') {
      list = list.filter((item) => item.category?.toLowerCase() === categoryFilter.value.toLowerCase())
    }
    if (paymentMethodFilter.value && paymentMethodFilter.value !== 'All Methods' && paymentMethodFilter.value !== 'All') {
      list = list.filter((item) => item.paymentMethod?.toLowerCase() === paymentMethodFilter.value.toLowerCase())
    }
    if (dateRange.value?.start || dateRange.value?.end) {
      list = list.filter((item) => isDateInRange(item.date || '', dateRange.value))
    }
    return list
  })

  const summary = computed<ExpenseReportSummary>(() => {
    const list = items.value
    const totalCategories = list.length
    const totalExpensesCount = list.reduce((acc, cur) => acc + (Number(cur.totalExpense) || 0), 0)
    const totalExpenseAmount = list.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
    return {
      totalCategories,
      totalExpensesCount,
      totalExpenseAmount,
      topExpenseCategory: list[0]?.category || '-',
      averageExpensePerCategory: totalCategories > 0 ? Math.round(totalExpenseAmount / totalCategories) : 0
    }
  })

  return {
    items,
    rawItems,
    searchQuery,
    categoryFilter,
    paymentMethodFilter,
    dateRange,
    summary,
    pending,
    error,
    refresh
  }
}

export interface UseIncomeReportOptions {
  search?: Ref<string> | string
  category?: Ref<string> | string
  paymentMethod?: Ref<string> | string
  dateRange?: Ref<DateRangeValue | null> | DateRangeValue | null
}

export function useIncomeReports(options: UseIncomeReportOptions = {}) {
  const searchQuery = isRef(options.search) ? options.search : ref(options.search || '')
  const categoryFilter = isRef(options.category) ? options.category : ref(options.category || '')
  const paymentMethodFilter = isRef(options.paymentMethod) ? options.paymentMethod : ref(options.paymentMethod || '')
  const dateRange = isRef(options.dateRange) ? options.dateRange : ref(options.dateRange || null)

  const { data, pending, error, refresh } = useApiFetch<IncomeReportResponse>('/api/reports/incomes', {
    key: 'reports-incomes',
    lazy: false
  })

  const rawItems = computed<IncomeReportItem[]>(() => data.value?.data ?? [])

  const items = computed<IncomeReportItem[]>(() => {
    let list = rawItems.value
    if (categoryFilter.value && categoryFilter.value !== 'All Categories' && categoryFilter.value !== 'All') {
      list = list.filter((item) => item.category?.toLowerCase() === categoryFilter.value.toLowerCase())
    }
    if (paymentMethodFilter.value && paymentMethodFilter.value !== 'All Methods' && paymentMethodFilter.value !== 'All') {
      list = list.filter((item) => item.paymentMethod?.toLowerCase() === paymentMethodFilter.value.toLowerCase())
    }
    if (dateRange.value?.start || dateRange.value?.end) {
      list = list.filter((item) => isDateInRange(item.date || '', dateRange.value))
    }
    return list
  })

  const summary = computed<IncomeReportSummary>(() => {
    const list = items.value
    const totalCategories = list.length
    const totalIncomesCount = list.reduce((acc, cur) => acc + (Number(cur.totalIncome) || 0), 0)
    const totalIncomeAmount = list.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
    return {
      totalCategories,
      totalIncomesCount,
      totalIncomeAmount,
      topIncomeCategory: list[0]?.category || '-',
      averageIncomePerCategory: totalCategories > 0 ? Math.round(totalIncomeAmount / totalCategories) : 0
    }
  })

  return {
    items,
    rawItems,
    searchQuery,
    categoryFilter,
    paymentMethodFilter,
    dateRange,
    summary,
    pending,
    error,
    refresh
  }
}
