import type { AdminDashboardSnapshot } from '#server/types/admin-dashboard'
import { readJSON } from './data'

function validNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
}

export function getAdminDashboard(): AdminDashboardSnapshot {
  const data = readJSON<AdminDashboardSnapshot>('admin-dashboard.json')
  const arrays = [data.primaryMetrics, data.secondaryMetrics, data.topSelling, data.lowStock, data.recentSales, data.transactionGroups, data.topCustomers, data.categories]
  if (!data || typeof data.welcomeName !== 'string' || !validNumber(data.ordersToday) || arrays.some((value) => !Array.isArray(value))) {
    throw createError({ statusCode: 500, statusMessage: 'Admin dashboard snapshot is invalid' })
  }
  if (data.primaryMetrics.some((item) => !item.id || !item.title || !validNumber(item.amount) || !validNumber(item.change))) {
    throw createError({ statusCode: 500, statusMessage: 'Admin dashboard metrics are invalid' })
  }
  if (data.transactionGroups.some((group) => !group.id || !Array.isArray(group.rows) || group.rows.some((row) => !row.id || !validNumber(row.amount)))) {
    throw createError({ statusCode: 500, statusMessage: 'Admin dashboard transactions are invalid' })
  }
  return data
}
