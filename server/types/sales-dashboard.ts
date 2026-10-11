export interface SalesDashboardBestSeller {
  id: number
  name: string
  price: number
  sales: number
  image: string
  category: string
  stock: number
}

export interface SalesDashboardTransaction {
  id: number
  name: string
  time: string
  paymentMethod: string
  reference: string
  status: 'Success' | 'Canceled' | 'Pending'
  amount: number
  image: string
  date: string
}

export interface SalesDashboardCountry {
  id: string
  name: string
  sales: string
  percentage: number
  x: number
  y: number
}

export interface SalesDashboardData {
  bestSellers: SalesDashboardBestSeller[]
  recentTransactions: SalesDashboardTransaction[]
  countryMarkers: SalesDashboardCountry[]
  yearlyData: Record<string, number[]>
}
