export interface TaxReportItem {
  id: string
  month: string
  monthNumber: number
  year: number
  date: string
  outputTax: number
  inputTax: number
  carryOverTax: number
  netTax: number
  status: 'Issued' | 'Pending' | 'Reported' | 'Paid'
  notes?: string
}

export interface TaxReportFilterParams {
  search?: string
  year?: string | number
  status?: string
  startDate?: string
  endDate?: string
}

export interface TaxReportSummary {
  totalOutputTax: number
  totalInputTax: number
  totalCarryOver: number
  totalNetTax: number
  underpaidMonthsCount: number
  overpaidMonthsCount: number
}

export interface ProfitLossItem {
  id: string
  code?: string
  description: string
  category: 'revenue' | 'cogs' | 'expense' | 'tax'
  categoryName?: string
  amount: number
  percentage: number
  year: number
  month?: string
  period: string
  order: number
}

export interface ProfitLossFilterParams {
  year?: string | number
  period?: string
  search?: string
  startDate?: string
  endDate?: string
}

export interface ProfitLossSummary {
  year: number
  period: string
  totalGrossRevenue: number
  totalCogs: number
  grossProfit: number
  grossProfitMargin: number
  totalOperatingExpenses: number
  operatingExpenseRatio: number
  ebt: number
  taxExpense: number
  netProfit: number
  netProfitMargin: number
}

export interface AnnualReportItem {
  id: string
  month: string
  monthNumber: number
  year: number
  date: string
  totalRevenue: number
  cogs: number
  grossProfit: number
  operatingExpenses: number
  netProfit: number
  netMarginPercent: number
}

export interface AnnualReportFilterParams {
  search?: string
  month?: string
  year?: string | number
  startDate?: string
  endDate?: string
}

export interface AnnualReportSummary {
  totalRevenue: number
  totalCogs: number
  totalGrossProfit: number
  totalOperatingExpenses: number
  totalNetProfit: number
  averageNetMarginPercent: number
  highestMonth?: string
  lowestMonth?: string
}
