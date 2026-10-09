import { defineEventHandler, getQuery } from 'h3'
import { readJSON } from '~/server/utils/data'
import type { TaxReportItem, TaxReportSummary } from '~/server/types/reports-financial'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const year = query.year ? String(query.year).trim() : ''
  const status = (query.status as string) || ''
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''

  const allItems = readJSON<TaxReportItem[]>('tax-reports.json', [])
  let filtered = [...allItems]

  if (search) {
    filtered = filtered.filter((item) =>
      item.month.toLowerCase().includes(search) ||
      String(item.year).includes(search) ||
      (item.notes && item.notes.toLowerCase().includes(search))
    )
  }

  if (year && year !== 'All' && year !== 'All Years' && year !== '') {
    filtered = filtered.filter((item) => String(item.year) === year)
  }

  if (status && status !== 'All' && status !== 'All Status' && status !== '') {
    filtered = filtered.filter((item) => item.status.toLowerCase() === status.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter((item) => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter((item) => !item.date || item.date <= endDate)
  }

  const totalOutputTax = filtered.reduce((acc, item) => acc + (Number(item.outputTax) || 0), 0)
  const totalInputTax = filtered.reduce((acc, item) => acc + (Number(item.inputTax) || 0), 0)
  const totalCarryOver = filtered.reduce((acc, item) => acc + (Number(item.carryOverTax) || 0), 0)
  const totalNetTax = filtered.reduce((acc, item) => acc + (Number(item.netTax) || 0), 0)
  const underpaidMonthsCount = filtered.filter((item) => Number(item.netTax) > 0).length
  const overpaidMonthsCount = filtered.filter((item) => Number(item.netTax) < 0).length

  const summary: TaxReportSummary = {
    totalOutputTax,
    totalInputTax,
    totalCarryOver,
    totalNetTax,
    underpaidMonthsCount,
    overpaidMonthsCount
  }

  return {
    success: true,
    data: filtered,
    summary,
    message: 'Tax reports fetched successfully'
  }
})
