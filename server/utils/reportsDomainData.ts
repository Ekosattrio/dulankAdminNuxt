import type {
  AnnualReportItem,
  AnnualReportSummary,
  ProfitLossItem,
  ProfitLossSummary,
  TaxReportItem,
  TaxReportSummary,
} from '~/server/types/reports-financial'
import type {
  SalesReportItem,
  PurchaseReportItem,
  InvoiceReportItem,
  BestSellerItem,
} from '~/server/types/reports-sales'
import type {
  ProductReportItem,
  ProductReportSummary,
  IncomeReportItem,
  IncomeReportSummary,
  ExpenseReportItem,
  ExpenseReportSummary,
} from '~/server/types/reports-operations'
import type {
  CustomerReportItem,
  CustomerDueReportItem,
  SupplierReportItem,
  SupplierDueReportItem,
} from '~/server/types/reports-stakeholders'
import { readJSON } from './data'

// 1. Annual Reports
export async function getAnnualReports(query?: { search?: string; month?: string; year?: string | number; startDate?: string; endDate?: string }): Promise<{ data: AnnualReportItem[]; summary: AnnualReportSummary }> {
  const allItems = await readJSON<AnnualReportItem[]>('annual-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const month = query?.month || ''
  const yearStr = query?.year ? String(query.year).trim() : ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.month.toLowerCase().includes(search) ||
      String(item.year).includes(search)
    )
  }

  if (month && month !== 'All' && month !== 'All Month' && month !== '') {
    filtered = filtered.filter(item => item.month.toLowerCase() === month.toLowerCase())
  }

  if (yearStr && yearStr !== 'All' && yearStr !== 'All Years' && yearStr !== '') {
    filtered = filtered.filter(item => String(item.year) === yearStr)
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  filtered.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return a.monthNumber - b.monthNumber
  })

  const totalRevenue = filtered.reduce((acc, item) => acc + (Number(item.totalRevenue) || 0), 0)
  const totalCogs = filtered.reduce((acc, item) => acc + (Number(item.cogs) || 0), 0)
  const totalGrossProfit = filtered.reduce((acc, item) => acc + (Number(item.grossProfit) || 0), 0)
  const totalOperatingExpenses = filtered.reduce((acc, item) => acc + (Number(item.operatingExpenses) || 0), 0)
  const totalNetProfit = filtered.reduce((acc, item) => acc + (Number(item.netProfit) || 0), 0)
  const averageNetMarginPercent = totalRevenue > 0 ? Number(((totalNetProfit / totalRevenue) * 100).toFixed(2)) : 0

  let highestMonth = '-'
  let lowestMonth = '-'
  if (filtered.length > 0) {
    const sortedByProfit = [...filtered].sort((a, b) => b.netProfit - a.netProfit)
    const highest = sortedByProfit[0]
    const lowest = sortedByProfit.at(-1)
    if (highest) highestMonth = `${highest.month} ${highest.year}`
    if (lowest) lowestMonth = `${lowest.month} ${lowest.year}`
  }

  const summary: AnnualReportSummary = {
    totalRevenue,
    totalCogs,
    totalGrossProfit,
    totalOperatingExpenses,
    totalNetProfit,
    averageNetMarginPercent,
    highestMonth,
    lowestMonth,
  }

  return { data: filtered, summary }
}

// 2. Best Seller Reports
export async function getBestSellerReports(query?: { search?: string; category?: string; startDate?: string; endDate?: string }): Promise<BestSellerItem[]> {
  const allItems = await readJSON<BestSellerItem[]>('best-seller-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const category = query?.category || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.product.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.unit.toLowerCase().includes(search)
    )
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  return filtered
}

// 3. Customer Due Reports
export async function getCustomerDueReports(query?: { search?: string; status?: string; paymentMethod?: string; startDate?: string; endDate?: string }): Promise<CustomerDueReportItem[]> {
  const allItems = await readJSON<CustomerDueReportItem[]>('customer-due-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''
  const paymentMethod = query?.paymentMethod || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.customerName.toLowerCase().includes(search) ||
      item.id.toLowerCase().includes(search) ||
      (item.paymentMethod && item.paymentMethod.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'All' && status !== '') {
    filtered = filtered.filter(item => item.status?.toLowerCase() === status.toLowerCase())
  }

  if (paymentMethod && paymentMethod !== 'All' && paymentMethod !== '') {
    filtered = filtered.filter(item => item.paymentMethod?.toLowerCase() === paymentMethod.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  return filtered
}

// 4. Customer Reports
export async function getCustomerReports(query?: { search?: string; status?: string; paymentMethod?: string; startDate?: string; endDate?: string }): Promise<CustomerReportItem[]> {
  const allItems = await readJSON<CustomerReportItem[]>('customer-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''
  const paymentMethod = query?.paymentMethod || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.customerName.toLowerCase().includes(search) ||
      item.id.toLowerCase().includes(search) ||
      (item.paymentMethod && item.paymentMethod.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'All' && status !== '') {
    filtered = filtered.filter(item => item.status?.toLowerCase() === status.toLowerCase())
  }

  if (paymentMethod && paymentMethod !== 'All' && paymentMethod !== '') {
    filtered = filtered.filter(item => item.paymentMethod?.toLowerCase() === paymentMethod.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  return filtered
}

// 5. Expense Reports
export async function getExpenseReports(query?: { search?: string; category?: string; paymentMethod?: string; startDate?: string; endDate?: string }): Promise<{ data: ExpenseReportItem[]; summary: ExpenseReportSummary }> {
  const allItems = await readJSON<ExpenseReportItem[]>('expense-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const category = query?.category || ''
  const paymentMethod = query?.paymentMethod || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.category.toLowerCase().includes(search) ||
      (item.paymentMethod && item.paymentMethod.toLowerCase().includes(search))
    )
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase())
  }

  if (paymentMethod && paymentMethod !== 'All' && paymentMethod !== '') {
    filtered = filtered.filter(item => item.paymentMethod?.toLowerCase() === paymentMethod.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  const totalCategories = filtered.length
  const totalExpensesCount = filtered.reduce((acc, item) => acc + (Number(item.totalExpense) || 0), 0)
  const totalExpenseAmount = filtered.reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  let topExpenseCategory = '-'
  let maxAmount = 0
  for (const item of filtered) {
    if ((Number(item.amount) || 0) > maxAmount) {
      maxAmount = Number(item.amount) || 0
      topExpenseCategory = item.category
    }
  }

  const averageExpensePerCategory = totalCategories > 0 ? Math.round(totalExpenseAmount / totalCategories) : 0

  const summary: ExpenseReportSummary = {
    totalCategories,
    totalExpensesCount,
    totalExpenseAmount,
    topExpenseCategory,
    averageExpensePerCategory,
  }

  return { data: filtered, summary }
}

// 6. Income Reports
export async function getIncomeReports(query?: { search?: string; category?: string; paymentMethod?: string; startDate?: string; endDate?: string }): Promise<{ data: IncomeReportItem[]; summary: IncomeReportSummary }> {
  const allItems = await readJSON<IncomeReportItem[]>('income-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const category = query?.category || ''
  const paymentMethod = query?.paymentMethod || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.category.toLowerCase().includes(search) ||
      (item.paymentMethod && item.paymentMethod.toLowerCase().includes(search))
    )
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase())
  }

  if (paymentMethod && paymentMethod !== 'All' && paymentMethod !== '') {
    filtered = filtered.filter(item => item.paymentMethod?.toLowerCase() === paymentMethod.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  const totalCategories = filtered.length
  const totalIncomesCount = filtered.reduce((acc, item) => acc + (Number(item.totalIncome) || 0), 0)
  const totalIncomeAmount = filtered.reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  let topIncomeCategory = '-'
  let maxAmount = 0
  for (const item of filtered) {
    if ((Number(item.amount) || 0) > maxAmount) {
      maxAmount = Number(item.amount) || 0
      topIncomeCategory = item.category
    }
  }

  const averageIncomePerCategory = totalCategories > 0 ? Math.round(totalIncomeAmount / totalCategories) : 0

  const summary: IncomeReportSummary = {
    totalCategories,
    totalIncomesCount,
    totalIncomeAmount,
    topIncomeCategory,
    averageIncomePerCategory,
  }

  return { data: filtered, summary }
}

// 7. Invoice Reports
export async function getInvoiceReports(query?: { search?: string; month?: string; year?: string | number; startDate?: string; endDate?: string }): Promise<InvoiceReportItem[]> {
  const allItems = await readJSON<InvoiceReportItem[]>('invoice-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const month = query?.month || ''
  const year = query?.year ? String(query.year) : ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.month.toLowerCase().includes(search) ||
      String(item.year).includes(search) ||
      (item.status && item.status.toLowerCase().includes(search))
    )
  }

  if (month && month !== 'All' && month !== '') {
    filtered = filtered.filter(item => item.month.toLowerCase() === month.toLowerCase())
  }

  if (year && year !== 'All' && year !== '') {
    filtered = filtered.filter(item => String(item.year) === year)
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  return filtered
}

// 8. Product Reports
export async function getProductReports(query?: { search?: string; category?: string; startDate?: string; endDate?: string }): Promise<{ data: ProductReportItem[]; summary: ProductReportSummary }> {
  const allItems = await readJSON<ProductReportItem[]>('product-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const category = query?.category || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.product.toLowerCase().includes(search) ||
      (item.sku && item.sku.toLowerCase().includes(search)) ||
      item.category.toLowerCase().includes(search) ||
      item.unit.toLowerCase().includes(search)
    )
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  const totalProducts = filtered.length
  const totalOrders = filtered.reduce((acc, item) => acc + (Number(item.totalOrder) || 0), 0)
  const totalRevenue = filtered.reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  const categoryMap: Record<string, number> = {}
  for (const item of filtered) {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + (Number(item.amount) || 0)
  }
  let topCategory = '-'
  let maxRevenue = 0
  for (const [cat, rev] of Object.entries(categoryMap)) {
    if (rev > maxRevenue) {
      maxRevenue = rev
      topCategory = cat
    }
  }

  const averageOrderValue = totalProducts > 0 ? Math.round(totalRevenue / totalProducts) : 0

  const summary: ProductReportSummary = {
    totalProducts,
    totalOrders,
    totalRevenue,
    topCategory,
    averageOrderValue,
  }

  return { data: filtered, summary }
}

// 9. Profit & Loss Reports
export async function getProfitLossReports(query?: { search?: string; year?: string | number; period?: string }): Promise<{ data: ProfitLossItem[]; summary: ProfitLossSummary }> {
  const allItems = await readJSON<ProfitLossItem[]>('profit-loss-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const yearStr = query?.year ? String(query.year).trim() : ''
  const period = query?.period || ''

  const targetYear = yearStr && yearStr !== 'All' ? Number(yearStr) : (period ? null : 2025)

  if (targetYear !== null) {
    filtered = filtered.filter(item => item.year === targetYear)
  }

  if (period && period !== 'All') {
    filtered = filtered.filter(item => item.period.toLowerCase() === period.toLowerCase())
  }

  if (search) {
    filtered = filtered.filter(item =>
      item.description.toLowerCase().includes(search) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(search)) ||
      (item.code && item.code.toLowerCase().includes(search))
    )
  }

  filtered.sort((a, b) => (a.order || 0) - (b.order || 0))

  const totalGrossRevenue = filtered
    .filter(item => item.category === 'revenue')
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  const totalCogs = filtered
    .filter(item => item.category === 'cogs')
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  const grossProfit = totalGrossRevenue - totalCogs
  const grossProfitMargin = totalGrossRevenue > 0 ? Number(((grossProfit / totalGrossRevenue) * 100).toFixed(2)) : 0

  const totalOperatingExpenses = filtered
    .filter(item => item.category === 'expense')
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  const operatingExpenseRatio = totalGrossRevenue > 0 ? Number(((totalOperatingExpenses / totalGrossRevenue) * 100).toFixed(2)) : 0
  const ebt = grossProfit - totalOperatingExpenses

  const taxExpense = filtered
    .filter(item => item.category === 'tax')
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  const netProfit = ebt - taxExpense
  const netProfitMargin = totalGrossRevenue > 0 ? Number(((netProfit / totalGrossRevenue) * 100).toFixed(2)) : 0

  const effectiveYear = targetYear || (filtered[0]?.year ?? 2025)
  const summary: ProfitLossSummary = {
    year: effectiveYear,
    period: period || String(effectiveYear),
    totalGrossRevenue,
    totalCogs,
    grossProfit,
    grossProfitMargin,
    totalOperatingExpenses,
    operatingExpenseRatio,
    ebt,
    taxExpense,
    netProfit,
    netProfitMargin,
  }

  return { data: filtered, summary }
}

// 10. Purchase Reports
export async function getPurchaseReports(query?: { search?: string; category?: string; startDate?: string; endDate?: string }): Promise<PurchaseReportItem[]> {
  const allItems = await readJSON<PurchaseReportItem[]>('purchase-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const category = query?.category || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.category.toLowerCase().includes(search) ||
      (item.supplier && item.supplier.toLowerCase().includes(search)) ||
      item.unit.toLowerCase().includes(search) ||
      (item.details && item.details.some(d => d.item.toLowerCase().includes(search)))
    )
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  return filtered
}

// 11. Sales Reports
export async function getSalesReport(query?: { search?: string; category?: string; channel?: string; startDate?: string; endDate?: string }): Promise<SalesReportItem[]> {
  const allItems = await readJSON<SalesReportItem[]>('sales-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const category = query?.category || ''
  const channel = query?.channel || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.category.toLowerCase().includes(search) ||
      (item.channel && item.channel.toLowerCase().includes(search)) ||
      item.unit.toLowerCase().includes(search) ||
      (item.details && item.details.some(d => d.product.toLowerCase().includes(search)))
    )
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase())
  }

  if (channel && channel !== 'All' && channel !== '') {
    filtered = filtered.filter(item => item.channel?.toLowerCase() === channel.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  return filtered
}

// 12. Supplier Due Reports
export async function getSupplierDueReports(query?: { search?: string; status?: string; category?: string; startDate?: string; endDate?: string }): Promise<SupplierDueReportItem[]> {
  const allItems = await readJSON<SupplierDueReportItem[]>('supplier-due-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''
  const category = query?.category || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.supplierName.toLowerCase().includes(search) ||
      (item.purchaseItem && item.purchaseItem.toLowerCase().includes(search)) ||
      (item.category && item.category.toLowerCase().includes(search)) ||
      item.id.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'All' && status !== '') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter(item => item.category?.toLowerCase() === category.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  return filtered
}

// 13. Supplier Reports
export async function getSupplierReports(query?: { search?: string; status?: string; category?: string; startDate?: string; endDate?: string }): Promise<SupplierReportItem[]> {
  const allItems = await readJSON<SupplierReportItem[]>('supplier-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''
  const category = query?.category || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.supplierName.toLowerCase().includes(search) ||
      item.purchaseItem.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.id.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'All' && status !== '') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  return filtered
}

// 14. Tax Reports
export async function getTaxReports(query?: { search?: string; year?: string | number; status?: string; startDate?: string; endDate?: string }): Promise<{ data: TaxReportItem[]; summary: TaxReportSummary }> {
  const allItems = await readJSON<TaxReportItem[]>('tax-reports.json', [])
  let filtered = [...allItems]

  const search = (query?.search || '').toLowerCase().trim()
  const year = query?.year ? String(query.year).trim() : ''
  const status = query?.status || ''
  const startDate = query?.startDate || ''
  const endDate = query?.endDate || ''

  if (search) {
    filtered = filtered.filter(item =>
      item.month.toLowerCase().includes(search) ||
      String(item.year).includes(search) ||
      (item.notes && item.notes.toLowerCase().includes(search))
    )
  }

  if (year && year !== 'All' && year !== 'All Years' && year !== '') {
    filtered = filtered.filter(item => String(item.year) === year)
  }

  if (status && status !== 'All' && status !== 'All Status' && status !== '') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter(item => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(item => !item.date || item.date <= endDate)
  }

  const totalOutputTax = filtered.reduce((acc, item) => acc + (Number(item.outputTax) || 0), 0)
  const totalInputTax = filtered.reduce((acc, item) => acc + (Number(item.inputTax) || 0), 0)
  const totalCarryOver = filtered.reduce((acc, item) => acc + (Number(item.carryOverTax) || 0), 0)
  const totalNetTax = filtered.reduce((acc, item) => acc + (Number(item.netTax) || 0), 0)
  const underpaidMonthsCount = filtered.filter(item => Number(item.netTax) > 0).length
  const overpaidMonthsCount = filtered.filter(item => Number(item.netTax) < 0).length

  const summary: TaxReportSummary = {
    totalOutputTax,
    totalInputTax,
    totalCarryOver,
    totalNetTax,
    underpaidMonthsCount,
    overpaidMonthsCount,
  }

  return { data: filtered, summary }
}

