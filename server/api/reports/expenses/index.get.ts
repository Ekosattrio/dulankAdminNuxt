import { defineEventHandler, getQuery } from 'h3'
import type { ExpenseReportItem, ExpenseReportSummary } from '~/server/types/reports-operations'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const category = (query.category as string) || ''
  const paymentMethod = (query.paymentMethod as string) || ''
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''

  const allItems = readJSON<ExpenseReportItem[]>('expense-reports.json', [])
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
    averageExpensePerCategory
  }

  return {
    success: true,
    data: filtered,
    summary,
    message: 'Expense reports fetched successfully'
  }
})
