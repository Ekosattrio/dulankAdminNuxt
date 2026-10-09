import { defineEventHandler, getQuery } from 'h3'
import type { SalesReportItem } from '~/server/types/reports-sales'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const category = (query.category as string) || ''
  const channel = (query.channel as string) || ''
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''

  const allItems = readJSON<SalesReportItem[]>('sales-reports.json', [])
  let filtered = [...allItems]

  if (search) {
    filtered = filtered.filter((item) =>
      item.category.toLowerCase().includes(search) ||
      (item.channel && item.channel.toLowerCase().includes(search)) ||
      item.unit.toLowerCase().includes(search) ||
      (item.details && item.details.some(d => d.product.toLowerCase().includes(search)))
    )
  }

  if (category && category !== 'All' && category !== '') {
    filtered = filtered.filter((item) => item.category.toLowerCase() === category.toLowerCase())
  }

  if (channel && channel !== 'All' && channel !== '') {
    filtered = filtered.filter((item) => item.channel?.toLowerCase() === channel.toLowerCase())
  }

  if (startDate) {
    filtered = filtered.filter((item) => !item.date || item.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter((item) => !item.date || item.date <= endDate)
  }

  return createResponse(filtered, 'Sales reports fetched successfully')
})
