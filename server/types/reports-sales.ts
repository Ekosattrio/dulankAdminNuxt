export interface SalesReportDetail {
  product: string
  soldQty: number
  unit: string
  totalRevenue: number
  percentage: number
}

export interface SalesReportItem {
  id: string
  category: string
  soldQty: number
  unit: string
  totalSales: number
  totalDue: number
  totalAmount: number
  percentage: number
  date?: string
  channel?: string
  details?: SalesReportDetail[]
}

export interface BestSellerItem {
  id: string
  rank: number
  category: string
  product: string
  soldQty: number
  unit: string
  total: number
  date?: string
}

export interface PurchaseReportDetail {
  item: string
  purchaseQty: number
  unit: string
  totalCost: number
  percentage: number
}

export interface PurchaseReportItem {
  id: string
  category: string
  purchaseQty: number
  unit: string
  totalPurchase: number
  totalDue: number
  totalAmount: number
  percentage: number
  date?: string
  supplier?: string
  details?: PurchaseReportDetail[]
}

export interface InvoiceReportItem {
  id: string
  month: string
  year: number
  totalInvoice: number
  netSales: number
  deliveryFee: number
  totalTax: number
  totalDiscount: number
  grossRevenue: number
  collectionRate: number
  date?: string
  status?: string
}

export interface ReportFilterParams {
  search?: string
  startDate?: string
  endDate?: string
  category?: string
  month?: string
  year?: string | number
  store?: string
  status?: string
}
