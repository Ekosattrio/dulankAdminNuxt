import { defineEventHandler, getQuery } from 'h3'
import type { PurchaseReportItem } from '~/server/types/reports-sales'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const category = (query.category as string) || ''
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''

  const allItems = readJSON<PurchaseReportItem[]>('purchase-reports.json', [])
  let filtered = [...allItems]

  if (search) {
    filtered = filtered.filter((item) =>
      item.category.toLowerCase().includes(search) ||
      (item.supplier && item.supplier.toLowerCase().includes(search)) ||
      item.unit.toLowerCase().includes(search) ||
      (item.details && item.details.some(d => d.item.toLowerCase().includes(search)))
    )
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter((item) => item.category.toLowerCase() === category.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter((item) => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter((item) => !item.date || item.date <= endDate)
  }

  return createResponse(filtered, 'Purchase reports fetched successfully')
})
