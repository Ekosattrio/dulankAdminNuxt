import { bestSellers, recentTransactions, countryMarkers } from '../data/sales-dashboard'

// GET /api/sales-dashboard — mock read-only (multi-array, tanpa CRUD)
export default defineEventHandler((event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Resource read-only' })
  }
  return { bestSellers, recentTransactions, countryMarkers }
})
