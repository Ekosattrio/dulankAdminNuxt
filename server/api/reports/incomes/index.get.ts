import { defineEventHandler, getQuery } from 'h3'
import type { IncomeReportItem, IncomeReportSummary } from '~/server/types/reports-operations'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const category = (query.category as string) || ''
  const paymentMethod = (query.paymentMethod as string) || ''
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''

  const allItems = readJSON<IncomeReportItem[]>('income-reports.json', [])
  let filtered = [...allItems]

  if (search) {
    filtered = filtered.filter((item) =>
      item.category.toLowerCase().includes(search) ||
      (item.paymentMethod && item.paymentMethod.toLowerCase().includes(search))
    )
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter((item) => item.category.toLowerCase() === category.toLowerCase())
  }

  if (paymentMethod && paymentMethod !== 'All' && paymentMethod !== '') {
    filtered = filtered.filter((item) => item.paymentMethod?.toLowerCase() === paymentMethod.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter((item) => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter((item) => !item.date || item.date <= endDate)
  }

  // Calculate summaries
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
    averageIncomePerCategory
  }

  return {
    success: true,
    data: filtered,
    summary,
    message: 'Income reports fetched successfully'
  }
})
