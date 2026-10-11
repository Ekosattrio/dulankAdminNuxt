import { bestSellers, countryMarkers, recentTransactions, yearlyData } from '../data/sales-dashboard'
import type { SalesDashboardData } from '../types/sales-dashboard'

export function getSalesDashboard(): SalesDashboardData {
  return { bestSellers, recentTransactions, countryMarkers, yearlyData }
}
