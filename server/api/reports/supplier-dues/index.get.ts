import { defineEventHandler, getQuery } from 'h3'
import type { SupplierDueReportItem } from '~/server/types/reports-stakeholders'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const status = (query.status as string) || ''
  const category = (query.category as string) || ''
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''

  const allItems = readJSON<SupplierDueReportItem[]>('supplier-due-reports.json', [])
  let filtered = [...allItems]

  if (search) {
    filtered = filtered.filter((item) =>
      item.supplierName.toLowerCase().includes(search) ||
      (item.purchaseItem && item.purchaseItem.toLowerCase().includes(search)) ||
      (item.category && item.category.toLowerCase().includes(search)) ||
      item.id.toLowerCase().includes(search)
    )
  }

  if (status && status !== 'All' && status !== '') {
    filtered = filtered.filter((item) => item.status.toLowerCase() === status.toLowerCase())
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter((item) => item.category?.toLowerCase() === category.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter((item) => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter((item) => !item.date || item.date <= endDate)
  }

  return createResponse(filtered, 'Supplier due reports fetched successfully')
})
