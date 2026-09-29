import { bestSellers, recentTransactions, countryMarkers } from '../data/sales-dashboard'

// GET /api/sales-dashboard — data mock: bestSellers, recentTransactions, countryMarkers
export default defineEventHandler(() => {
  return { bestSellers, recentTransactions, countryMarkers }
})
