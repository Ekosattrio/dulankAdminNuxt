import { defineEventHandler, getQuery } from 'h3'
import { readJSON } from '~/server/utils/data'
import type { AnnualReportItem, AnnualReportSummary } from '~/server/types/reports-financial'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const month = (query.month as string) || ''
  const yearStr = query.year ? String(query.year).trim() : ''
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''

  const allItems = readJSON<AnnualReportItem[]>('annual-reports.json', [])
  let filtered = [...allItems]

  if (search) {
    filtered = filtered.filter((item) =>
      item.month.toLowerCase().includes(search) ||
      String(item.year).includes(search)
    )
  }

  if (month && month !== 'All' && month !== 'All Month' && month !== '') {
    filtered = filtered.filter((item) => item.month.toLowerCase() === month.toLowerCase())
  }

  if (yearStr && yearStr !== 'All' && yearStr !== 'All Years' && yearStr !== '') {
    filtered = filtered.filter((item) => String(item.year) === yearStr)
  }

  if (startDate) {
    filtered = filtered.filter((item) => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter((item) => !item.date || item.date <= endDate)
  }

  // Sort chronologically
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
    lowestMonth
  }

  return {
    success: true,
    data: filtered,
    summary,
    message: 'Annual reports fetched successfully'
  }
})
