export interface StakeholderReportFilterParams {
  search?: string
  status?: string
  category?: string
  paymentMethod?: string
  startDate?: string
  endDate?: string
  limit?: number
  page?: number
}

export interface SupplierReportHistoryItem {
  date: string
  category: string
  purchaseItem: string
  qty: number
  amount: number
}

export interface SupplierReportItem {
  id: string
  supplierId?: string
  supplierName: string
  date: string
  category: string
  purchaseItem: string
  qty: number
  amount: number
  totalPurchased?: number
  totalPaid?: number
  balanceDue?: number
  status: 'Received' | 'Overdue' | 'Unpaid' | string
  avgLeadTime?: string
  totalTransactions?: number
  history?: SupplierReportHistoryItem[]
}

export interface SupplierDueHistoryItem {
  date: string
  purchaseNo: string
  amount: number
  paid: number
  due: number
}

export interface SupplierDueReportItem {
  id: string
  supplierId?: string
  supplierName: string
  date: string
  category?: string
  purchaseItem?: string
  qty?: number
  amount?: number
  purchasesDue: number
  amountDue: number
  daysDue: number
  status: 'Received' | 'Overdue' | 'Unpaid' | string
  avgLeadTime?: string
  history?: SupplierDueHistoryItem[]
}

export interface CustomerReportHistoryItem {
  date: string
  invoiceNo: string
  product: string
  qty: number
  amount: number
  status: string
}

export interface CustomerReportItem {
  id: string
  customerId?: string
  customerName: string
  totalOrder: number
  amount: number
  totalSpent?: number
  totalPaid?: number
  balanceDue?: number
  avgLeadTime: string
  paymentMethod?: 'Transfer' | 'Credit Card' | 'Cash' | string
  status?: 'Received' | 'Overdue' | 'Unpaid' | string
  date?: string
  history?: CustomerReportHistoryItem[]
}

export interface CustomerDueHistoryItem {
  date: string
  invoiceNo: string
  amount: number
  paid: number
  due: number
  daysOverdue: number
}

export interface CustomerDueReportItem {
  id: string
  customerId?: string
  customerName: string
  orderDue: number
  amountDue: number
  overdueAmount?: number
  daysDue: number
  status?: 'Received' | 'Overdue' | 'Unpaid' | string
  paymentMethod?: string
  date?: string
  history?: CustomerDueHistoryItem[]
}

export interface StakeholderReportSummary {
  totalStakeholders: number
  totalTransactions: number
  totalPaid: number
  totalDue: number
}
