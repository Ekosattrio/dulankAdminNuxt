import { defineEventHandler, getQuery } from 'h3'
import type { CustomerDueReportItem } from '~/server/types/reports-stakeholders'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const status = (query.status as string) || ''
  const paymentMethod = (query.paymentMethod as string) || ''
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''

  const allItems = readJSON<CustomerDueReportItem[]>('customer-due-reports.json', [])
  let filtered = [...allItems]

  if (search) {
    filtered = filtered.filter((item) =>
      item.customerName.toLowerCase().includes(search) ||
      item.id.toLowerCase().includes(search) ||
      (item.paymentMethod && item.paymentMethod.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'All' && status !== '') {
    filtered = filtered.filter((item) => item.status?.toLowerCase() === status.toLowerCase())
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

  return createResponse(filtered, 'Customer due reports fetched successfully')
})
