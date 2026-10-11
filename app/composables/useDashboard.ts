export interface DashboardOrderRow {
  no: string
  customer: string | null
  status: string
  total: number
  date: string | null
}

export interface DashboardTopProduct {
  name: string
  qty: number
}

export interface DashboardMonthTrend {
  month: number
  sales: number
  purchases: number
}

export interface DashboardSummary {
  ordersToday: number
  revenueToday: number
  ordersTotal: number
  pendingPayments: number
  openTickets: number
  totalBalance: number
  totalSales: number
  totalSalesReturn: number
  totalPurchase: number
  totalPurchaseReturn: number
  totalIncome: number
  totalExpense: number
  invoiceDue: number
  totalCustomers: number
  totalSuppliers: number
  lowStock: number
  recentOrders: DashboardOrderRow[]
  topProducts: DashboardTopProduct[]
  monthlyTrend: DashboardMonthTrend[]
}

/**
 * Ringkasan dashboard admin — backend Laravel `/api/v1/admin/dashboard`
 * (satu panggilan untuk seluruh KPI, grafik bulanan, dan data pendukung).
 */
export function useDashboard() {
  const { data, pending, error, refresh } = useApiFetch<{
    success: boolean
    data: DashboardSummary
  }>('/api/v1/admin/dashboard', {
    key: 'admin-dashboard'
  })

  const summary = computed<DashboardSummary | null>(() => data.value?.data ?? null)

  return {
    summary,
    pending,
    error,
    refresh
  }
}