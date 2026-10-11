export type AdminDashboardPeriod = 'Today' | 'Weekly' | 'Monthly'
export type AdminDashboardChartRange = '1D' | '1W' | '1M' | '1Y'

export interface AdminDashboardMetric {
  id: string
  title: string
  amount: number
  change: number
  icon: string
  tone: 'orange' | 'navy' | 'green' | 'blue' | 'plain'
  link?: string
}

export interface AdminDashboardChartSeries {
  labels: string[]
  sales: number[]
  purchase: number[]
}

export interface AdminDashboardOverview {
  suppliers: number
  customers: number
  orders: number
  firstTime: number
  firstTimeChange: number
  returning: number
  returningChange: number
}

export interface AdminDashboardProduct {
  id: string
  name: string
  image: string
  price: number
  sales?: number
  change?: number
  sku?: string
  stock?: number
  stockTone?: 'danger' | 'success' | 'warning'
}

export interface AdminDashboardRecentSale {
  id: string
  name: string
  image: string
  category: string
  amount: number
  date: string
  status: string
}

export interface AdminDashboardTransaction {
  id: string
  date: string
  name: string
  code: string
  status: string
  amount: number
  image?: string
}

export interface AdminDashboardTransactionGroup {
  id: 'sale' | 'purchase' | 'quotation' | 'expense' | 'invoice'
  label: string
  subjectLabel: string
  dateLabel: string
  amountLabel: string
  subjectFirst?: boolean
  rows: AdminDashboardTransaction[]
}

export interface AdminDashboardCustomer {
  id: string
  name: string
  country: string
  orders: number
  amount: number
  image: string
}

export interface AdminDashboardCategory {
  id: string
  name: string
  sales: number
  color: string
}

export interface AdminDashboardSnapshot {
  welcomeName: string
  ordersToday: number
  lowStockNotice: { productName: string; threshold: number; link: string }
  primaryMetrics: AdminDashboardMetric[]
  secondaryMetrics: AdminDashboardMetric[]
  chartSeries: Record<AdminDashboardChartRange, AdminDashboardChartSeries>
  overview: AdminDashboardOverview
  topSelling: AdminDashboardProduct[]
  lowStock: AdminDashboardProduct[]
  recentSales: AdminDashboardRecentSale[]
  salesStatics: { year: number; revenue: number; expense: number; revenueChange: number; expenseChange: number; points: number[] }
  transactionGroups: AdminDashboardTransactionGroup[]
  topCustomers: AdminDashboardCustomer[]
  categories: AdminDashboardCategory[]
  categoryTotals: { categories: number; products: number }
  orderStatistics: { labels: string[]; values: number[][] }
}
