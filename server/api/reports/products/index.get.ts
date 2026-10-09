import { defineEventHandler, getQuery } from 'h3'
import type { ProductReportItem, ProductReportSummary } from '~/server/types/reports-operations'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = ((query.search as string) || '').toLowerCase().trim()
  const category = (query.category as string) || ''
  const startDate = (query.startDate as string) || ''
  const endDate = (query.endDate as string) || ''

  const allItems = readJSON<ProductReportItem[]>('product-reports.json', [])
  let filtered = [...allItems]

  if (search) {
    filtered = filtered.filter((item) =>
      item.product.toLowerCase().includes(search) ||
      (item.sku && item.sku.toLowerCase().includes(search)) ||
      item.category.toLowerCase().includes(search) ||
      item.unit.toLowerCase().includes(search)
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

  // Calculate summaries
  const totalProducts = filtered.length
  const totalOrders = filtered.reduce((acc, item) => acc + (Number(item.totalOrder) || 0), 0)
  const totalRevenue = filtered.reduce((acc, item) => acc + (Number(item.amount) || 0), 0)
  
  // Find top selling category
  const categoryMap: Record<string, number> = {}
  for (const item of filtered) {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + (Number(item.amount) || 0)
  }
  let topCategory = '-'
  let maxRevenue = 0
  for (const [cat, rev] of Object.entries(categoryMap)) {
    if (rev > maxRevenue) {
      maxRevenue = rev
      topCategory = cat
    }
  }

  const averageOrderValue = totalProducts > 0 ? Math.round(totalRevenue / totalProducts) : 0

  const summary: ProductReportSummary = {
    totalProducts,
    totalOrders,
    totalRevenue,
    topCategory,
    averageOrderValue
  }

  return {
    success: true,
    data: filtered,
    summary,
    message: 'Product reports fetched successfully'
  }
})
