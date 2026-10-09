import { ref, computed, isRef, type Ref } from 'vue'
import type {
  TaxReportItem,
  TaxReportSummary,
  ProfitLossItem,
  ProfitLossSummary,
  AnnualReportItem,
  AnnualReportSummary
} from '~/server/types/reports-financial'
import { isDateInRange, type DateRangeValue } from '~/composables/useDateRange'

interface TaxReportResponse {
  success: boolean
  data: TaxReportItem[]
  summary?: TaxReportSummary
  message?: string
}

interface ProfitLossResponse {
  success: boolean
  data: ProfitLossItem[]
  summary?: ProfitLossSummary
  message?: string
}

interface AnnualReportResponse {
  success: boolean
  data: AnnualReportItem[]
  summary?: AnnualReportSummary
  message?: string
}

export interface UseTaxReportOptions {
  search?: Ref<string> | string
  year?: Ref<string | number> | string | number
  status?: Ref<string> | string
  dateRange?: Ref<DateRangeValue | null> | DateRangeValue | null
}

export function useTaxReports(options: UseTaxReportOptions = {}) {
  const searchQuery = isRef(options.search) ? options.search : ref(options.search || '')
  const yearFilter = isRef(options.year) ? options.year : ref(options.year || '')
  const statusFilter = isRef(options.status) ? options.status : ref(options.status || '')
  const dateRange = isRef(options.dateRange) ? options.dateRange : ref(options.dateRange || null)

  const { data, pending, error, refresh } = useApiFetch<TaxReportResponse>('/api/reports/taxes', {
    key: 'reports-taxes',
    lazy: false
  })

  const rawItems = computed<TaxReportItem[]>(() => data.value?.data ?? [])

  const items = computed<TaxReportItem[]>(() => {
    let list = rawItems.value
    if (yearFilter.value && yearFilter.value !== 'All' && yearFilter.value !== 'All Years') {
      list = list.filter((i) => String(i.year).includes(String(yearFilter.value)) || String(i.date).includes(String(yearFilter.value)))
    }
    if (statusFilter.value && statusFilter.value !== 'All' && statusFilter.value !== 'All Status') {
      list = list.filter((i) => i.status?.toLowerCase() === String(statusFilter.value).toLowerCase())
    }
    if (dateRange.value?.start || dateRange.value?.end) {
      list = list.filter((i) => isDateInRange(i.date, dateRange.value))
    }
    return list
  })

  const summary = computed<TaxReportSummary>(() => {
    const list = items.value
    const totalOutputTax = list.reduce((acc, cur) => acc + (Number(cur.outputTax) || 0), 0)
    const totalInputTax = list.reduce((acc, cur) => acc + (Number(cur.inputTax) || 0), 0)
    const totalCarryOver = list.reduce((acc, cur) => acc + (Number(cur.carryOverTax) || 0), 0)
    const totalNetTax = list.reduce((acc, cur) => acc + (Number(cur.netTax) || 0), 0)
    const underpaidMonthsCount = list.filter((cur) => Number(cur.netTax) > 0).length
    const overpaidMonthsCount = list.filter((cur) => Number(cur.netTax) < 0).length

    return {
      totalOutputTax,
      totalInputTax,
      totalCarryOver,
      totalNetTax,
      underpaidMonthsCount,
      overpaidMonthsCount
    }
  })

  return {
    items,
    rawItems,
    searchQuery,
    yearFilter,
    statusFilter,
    dateRange,
    summary,
    pending,
    error,
    refresh
  }
}

export interface UseProfitLossReportOptions {
  year?: Ref<string | number> | string | number
  period?: Ref<string> | string
  search?: Ref<string> | string
  dateRange?: Ref<DateRangeValue | null> | DateRangeValue | null
}

export function useProfitLossReports(options: UseProfitLossReportOptions = {}) {
  const searchQuery = isRef(options.search) ? options.search : ref(options.search || '')
  const yearFilter = isRef(options.year) ? options.year : ref(options.year || 2025)
  const periodFilter = isRef(options.period) ? options.period : ref(options.period || '')
  const dateRange = isRef(options.dateRange) ? options.dateRange : ref(options.dateRange || null)

  const { data, pending, error, refresh } = useApiFetch<ProfitLossResponse>('/api/reports/profit-loss', {
    key: 'reports-profit-loss',
    lazy: false
  })

  const rawItems = computed<ProfitLossItem[]>(() => data.value?.data ?? [])

  const items = computed<ProfitLossItem[]>(() => {
    let list = rawItems.value
    if (yearFilter.value && yearFilter.value !== 'All') {
      list = list.filter((i) => !i.year || String(i.year) === String(yearFilter.value))
    }
    if (periodFilter.value && periodFilter.value !== 'All' && periodFilter.value !== 'Semua Periode' && periodFilter.value !== '') {
      list = list.filter((i) => !i.period || i.period === periodFilter.value)
    }
    if (dateRange.value?.start || dateRange.value?.end) {
      list = list.filter((i) => isDateInRange(`${i.year}-01-01`, dateRange.value))
    }
    return list
  })

  const revenueItems = computed(() => items.value.filter((i) => i.category === 'revenue'))
  const cogsItems = computed(() => items.value.filter((i) => i.category === 'cogs'))
  const expenseItems = computed(() => items.value.filter((i) => i.category === 'expense'))
  const taxItems = computed(() => items.value.filter((i) => i.category === 'tax'))

  const summary = computed<ProfitLossSummary>(() => {
    const rev = revenueItems.value.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
    const cogs = cogsItems.value.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
    const grossProfit = rev - cogs
    const grossProfitMargin = rev > 0 ? Number(((grossProfit / rev) * 100).toFixed(2)) : 0

    const opex = expenseItems.value.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
    const operatingExpenseRatio = rev > 0 ? Number(((opex / rev) * 100).toFixed(2)) : 0
    const ebt = grossProfit - opex

    const tax = taxItems.value.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
    const netProfit = ebt - tax
    const netProfitMargin = rev > 0 ? Number(((netProfit / rev) * 100).toFixed(2)) : 0

    return {
      year: Number(yearFilter.value) || 2025,
      period: String(periodFilter.value || yearFilter.value || 2025),
      totalGrossRevenue: rev,
      totalCogs: cogs,
      grossProfit,
      grossProfitMargin,
      totalOperatingExpenses: opex,
      operatingExpenseRatio,
      ebt,
      taxExpense: tax,
      netProfit,
      netProfitMargin
    }
  })

  return {
    items,
    rawItems,
    searchQuery,
    revenueItems,
    cogsItems,
    expenseItems,
    taxItems,
    summary,
    pending,
    error,
    refresh
  }
}

export interface UseAnnualReportOptions {
  search?: Ref<string> | string
  month?: Ref<string> | string
  year?: Ref<string | number> | string | number
  dateRange?: Ref<DateRangeValue | null> | DateRangeValue | null
}

export function useAnnualReports(options: UseAnnualReportOptions = {}) {
  const searchQuery = isRef(options.search) ? options.search : ref(options.search || '')
  const monthFilter = isRef(options.month) ? options.month : ref(options.month || '')
  const yearFilter = isRef(options.year) ? options.year : ref(options.year || '')
  const dateRange = isRef(options.dateRange) ? options.dateRange : ref(options.dateRange || null)

  const { data, pending, error, refresh } = useApiFetch<AnnualReportResponse>('/api/reports/annual', {
    key: 'reports-annual',
    lazy: false
  })

  const rawItems = computed<AnnualReportItem[]>(() => data.value?.data ?? [])

  const items = computed<AnnualReportItem[]>(() => {
    let list = rawItems.value
    if (monthFilter.value && monthFilter.value !== 'All' && monthFilter.value !== 'All Month') {
      list = list.filter((i) => i.month.toLowerCase() === String(monthFilter.value).toLowerCase())
    }
    if (yearFilter.value && yearFilter.value !== 'All' && yearFilter.value !== 'All Years') {
      list = list.filter((i) => String(i.year) === String(yearFilter.value))
    }
    if (dateRange.value?.start || dateRange.value?.end) {
      list = list.filter((i) => isDateInRange(i.date || '', dateRange.value))
    }
    return list
  })

  const summary = computed<AnnualReportSummary>(() => {
    const list = items.value
    const totalRevenue = list.reduce((acc, cur) => acc + (Number(cur.totalRevenue) || 0), 0)
    const totalCogs = list.reduce((acc, cur) => acc + (Number(cur.cogs) || 0), 0)
    const totalGrossProfit = list.reduce((acc, cur) => acc + (Number(cur.grossProfit) || 0), 0)
    const totalOperatingExpenses = list.reduce((acc, cur) => acc + (Number(cur.operatingExpenses) || 0), 0)
    const totalNetProfit = list.reduce((acc, cur) => acc + (Number(cur.netProfit) || 0), 0)
    const averageNetMarginPercent = totalRevenue > 0 ? Number(((totalNetProfit / totalRevenue) * 100).toFixed(2)) : 0

    return {
      totalRevenue,
      totalCogs,
      totalGrossProfit,
      totalOperatingExpenses,
      totalNetProfit,
      averageNetMarginPercent,
      highestMonth: list[0]?.month || '-',
      lowestMonth: list[list.length - 1]?.month || '-'
    }
  })

  return {
    items,
    rawItems,
    searchQuery,
    monthFilter,
    yearFilter,
    dateRange,
    summary,
    pending,
    error,
    refresh
  }
}

export function useFinancialReports() {
  return {
    useTaxReports,
    useProfitLossReports,
    useAnnualReports
  }
}
