import { defineEventHandler, getQuery } from 'h3'
import type { InvoiceReportItem } from '~/server/types/reports-sales'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const month = (query.month as string) || ''
  const year = (query.year as string) || ''
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''

  const allItems = readJSON<InvoiceReportItem[]>('invoice-reports.json', [])
  let filtered = [...allItems]

  if (search) {
    filtered = filtered.filter((item) =>
      item.month.toLowerCase().includes(search) ||
      String(item.year).includes(search) ||
      (item.status && item.status.toLowerCase().includes(search))
    )
  }

  if (month && month !== 'All' && month !== '') {
    filtered = filtered.filter((item) => item.month.toLowerCase() === month.toLowerCase())
  }

  if (year && year !== 'All' && year !== '') {
    filtered = filtered.filter((item) => String(item.year) === String(year))
  }

  if (startDate) {
    filtered = filtered.filter((item) => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter((item) => !item.date || item.date <= endDate)
  }

  return createResponse(filtered, 'Invoice reports fetched successfully')
})
