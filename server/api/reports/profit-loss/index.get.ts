import { defineEventHandler, getQuery } from 'h3'
import { readJSON } from '~/server/utils/data'
import type { ProfitLossItem, ProfitLossSummary } from '~/server/types/reports-financial'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const yearStr = query.year ? String(query.year).trim() : ''
  const period = (query.period as string) || ''

  const allItems = readJSON<ProfitLossItem[]>('profit-loss-reports.json', [])
  let filtered = [...allItems]

  // Default to 2025 if no year or period filter
  const targetYear = yearStr && yearStr !== 'All' ? Number(yearStr) : (period ? null : 2025)

  if (targetYear !== null) {
    filtered = filtered.filter((item) => item.year === targetYear)
  }

  if (period && period !== 'All') {
    filtered = filtered.filter((item) => item.period.toLowerCase() === period.toLowerCase())
  }

  if (search) {
    filtered = filtered.filter((item) =>
      item.description.toLowerCase().includes(search) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(search)) ||
      (item.code && item.code.toLowerCase().includes(search))
    )
  }

  // Sort by defined order
  filtered.sort((a, b) => (a.order || 0) - (b.order || 0))

  // Calculate summary metrics
  const totalGrossRevenue = filtered
    .filter((item) => item.category === 'revenue')
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  const totalCogs = filtered
    .filter((item) => item.category === 'cogs')
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  const grossProfit = totalGrossRevenue - totalCogs
  const grossProfitMargin = totalGrossRevenue > 0 ? Number(((grossProfit / totalGrossRevenue) * 100).toFixed(2)) : 0

  const totalOperatingExpenses = filtered
    .filter((item) => item.category === 'expense')
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0)

  const operatingExpenseRatio = totalGrossRevenue > 0 ? Number(((totalOperatingExpenses / totalGrossRevenue) * 100).toFixed(2)) : 0

  const ebt = grossProfit - totalOperatingExpenses

  const taxExpense = filtered
    .filter((item) => item.category === 'tax')
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
    netProfitMargin
  }

  return {
    success: true,
    data: filtered,
    summary,
    message: 'Profit & Loss report fetched successfully'
  }
})
