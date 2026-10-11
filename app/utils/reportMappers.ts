import type {
  SalesReportItem,
  BestSellerItem,
  PurchaseReportItem,
  InvoiceReportItem,
} from '#server/types/reports-sales'
import type { TaxReportItem, ProfitLossItem, AnnualReportItem } from '#server/types/reports-financial'
import type {
  ProductReportItem,
  ExpenseReportItem,
  IncomeReportItem,
} from '#server/types/reports-operations'
import type {
  SupplierReportItem,
  SupplierDueReportItem,
  CustomerReportItem,
  CustomerDueReportItem,
} from '#server/types/reports-stakeholders'

// ---------------------------------------------------------------------------
// Bentuk payload endpoint `/api/v1/admin/reports/{type}` (backend Laravel).
// Mapper di bawah mengubah bentuk agregat backend menjadi array item sesuai
// kontrak tipe admin agar tabel & ringkasan UI tetap berfungsi.
// ---------------------------------------------------------------------------

export interface SalesApiPayload {
  totalOrders: number
  totalSales: number
  totalPaid: number
  totalDue: number
  byChannel: Array<{ channel: string; totalOrders: number; totalSales: number }>
  byStatus: Array<{ status: string; totalOrders: number }>
  topProducts: Array<{ name: string; qty: number; amount: number }>
}

export interface BestSellerApiPayload {
  products: Array<{ name: string; qty: number; amount: number }>
}

export interface PurchasesApiPayload {
  totalPurchases: number
  totalAmount: number
  totalPaid: number
  totalDue: number
  bySupplier: Array<{ supplier: string; totalPurchases: number; totalAmount: number }>
}

export interface InvoicesApiPayload {
  totalInvoices: number
  totalAmount: number
  totalPaid: number
  totalDue: number
  byStatus: Array<{ status: string; total: number; amount: number; paid: number; due: number }>
}

export interface TaxesApiPayload {
  output: { dpp: number; vat: number; total: number; documents: Record<string, number> }
  input: { dpp: number; vat: number; documents: Record<string, number> }
}

export interface ProfitLossApiPayload {
  revenue: number
  cogs: number
  grossProfit: number
  expense: number
  otherIncome: number
  netProfit: number
}

export interface AnnualApiPayload {
  year: number
  months: Array<{ month: number; totalOrders: number; totalSales: number }>
  totalOrders: number
  totalSales: number
}

export interface ProductsApiPayload {
  totalProducts: number
  activeProducts: number
  lowStock: Array<{ id: string; name: string; quantity: number; quantityAlert: number }>
  topSelling: Array<{ name: string; qty: number; amount: number }>
}

export interface ExpensesApiPayload {
  totalAmount: number
  totalPaid: number
  byCategory: Array<{ category: string; total: number; amount: number; paid: number; due: number }>
}

export interface IncomesApiPayload {
  totalAmount: number
  byCategory: Array<{ category: string; total: number; amount: number }>
}

export interface SuppliersApiPayload {
  suppliers: Array<{
    supplierId: string
    supplier: string
    totalPurchases: number
    amount: number
    paid: number
    due: number
  }>
}

export interface SupplierDuesApiPayload {
  totalDue: number
  suppliers: Array<{ supplierId: string; supplier: string; totalPurchases: number; due: number }>
}

export interface CustomersApiPayload {
  totalCustomers: number
  topCustomers: Array<{ customerId: string; customer: string; totalSales: number }>
}

export interface CustomerDuesApiPayload {
  totalDue: number
  customers: Array<{ customerId: string; customer: string; email: string | null; due: number }>
}

const wholePercent = (part: number, whole: number): number =>
  whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function mapSalesReport(payload: SalesApiPayload | undefined): SalesReportItem[] {
  if (!payload) return []

  return payload.byChannel.map((row) => ({
    id: row.channel,
    category: row.channel,
    soldQty: row.totalOrders,
    unit: '',
    totalSales: row.totalSales,
    totalDue: 0,
    totalAmount: row.totalSales,
    percentage: wholePercent(row.totalSales, payload.totalSales),
    date: undefined,
    channel: row.channel,
    details: payload.topProducts.map((product) => ({
      product: product.name,
      soldQty: product.qty,
      unit: '',
      totalRevenue: product.amount,
      percentage: wholePercent(product.amount, row.totalSales),
    })),
  }))
}

export function mapBestSeller(payload: BestSellerApiPayload | undefined): BestSellerItem[] {
  if (!payload) return []

  return payload.products.map((row, index) => ({
    id: row.name,
    rank: index + 1,
    category: '',
    product: row.name,
    soldQty: row.qty,
    unit: '',
    total: row.amount,
    date: undefined,
  }))
}

export function mapPurchaseReport(payload: PurchasesApiPayload | undefined): PurchaseReportItem[] {
  if (!payload) return []

  return payload.bySupplier.map((row) => ({
    id: row.supplier,
    category: row.supplier,
    purchaseQty: row.totalPurchases,
    unit: '',
    totalPurchase: row.totalAmount,
    totalDue: 0,
    totalAmount: row.totalAmount,
    percentage: wholePercent(row.totalAmount, payload.totalAmount),
    date: undefined,
    supplier: row.supplier,
    details: [],
  }))
}

export function mapInvoiceReport(payload: InvoicesApiPayload | undefined): InvoiceReportItem[] {
  if (!payload) return []

  const year = new Date().getFullYear()

  return payload.byStatus.map((row) => ({
    id: row.status,
    month: row.status,
    year,
    totalInvoice: row.total,
    netSales: row.amount,
    deliveryFee: 0,
    totalTax: 0,
    totalDiscount: 0,
    grossRevenue: row.amount,
    collectionRate: row.amount > 0 ? Math.round((row.paid / row.amount) * 100) : 0,
    date: undefined,
    status: row.status,
  }))
}

export function mapTaxReport(payload: TaxesApiPayload | undefined): TaxReportItem[] {
  if (!payload) return []

  const now = new Date()

  return [{
    id: `${now.getFullYear()}-${now.getMonth() + 1}`,
    month: MONTHS[now.getMonth()] ?? '',
    monthNumber: now.getMonth() + 1,
    year: now.getFullYear(),
    date: now.toISOString().slice(0, 10),
    outputTax: payload.output.vat,
    inputTax: payload.input.vat,
    carryOverTax: 0,
    netTax: payload.output.vat - payload.input.vat,
    status: 'Pending' as const,
  }]
}

export function mapProfitLoss(payload: ProfitLossApiPayload | undefined): ProfitLossItem[] {
  if (!payload) return []

  const year = new Date().getFullYear()
  const period = `${year}`

  const rows: ProfitLossItem[] = [
    {
      id: 'revenue',
      description: 'Pendapatan (Penjualan)',
      category: 'revenue',
      categoryName: 'Pendapatan',
      amount: payload.revenue,
      percentage: wholePercent(payload.revenue, payload.revenue),
      year,
      period,
      order: 1,
    },
    {
      id: 'cogs',
      description: 'Harga Pokok Penjualan',
      category: 'cogs',
      categoryName: 'HPP',
      amount: payload.cogs,
      percentage: wholePercent(payload.cogs, payload.revenue),
      year,
      period,
      order: 2,
    },
    {
      id: 'expense',
      description: 'Beban Operasional',
      category: 'expense',
      categoryName: 'Beban',
      amount: payload.expense,
      percentage: wholePercent(payload.expense, payload.revenue),
      year,
      period,
      order: 3,
    },
    {
      id: 'income',
      description: 'Pendapatan Lain',
      category: 'revenue',
      categoryName: 'Pendapatan Lain',
      amount: payload.otherIncome,
      percentage: wholePercent(payload.otherIncome, payload.revenue),
      year,
      period,
      order: 4,
    },
  ]

  return rows
}

export function mapAnnualReport(payload: AnnualApiPayload | undefined): AnnualReportItem[] {
  if (!payload) return []

  return payload.months.map((row) => ({
    id: `${payload.year}-${row.month}`,
    month: MONTHS[(row.month - 1) % 12] ?? `${row.month}`,
    monthNumber: row.month,
    year: payload.year,
    date: `${payload.year}-${String(row.month).padStart(2, '0')}-01`,
    totalRevenue: row.totalSales,
    cogs: 0,
    grossProfit: row.totalSales,
    operatingExpenses: 0,
    netProfit: row.totalSales,
    netMarginPercent: 100,
  }))
}

export function mapProductReport(payload: ProductsApiPayload | undefined): ProductReportItem[] {
  if (!payload) return []

  const totalAmount = payload.topSelling.reduce((sum, row) => sum + row.amount, 0)

  return payload.topSelling.map((row) => ({
    id: row.name,
    product: row.name,
    category: '',
    totalOrder: row.qty,
    unit: '',
    amount: row.amount,
    percentage: wholePercent(row.amount, totalAmount),
    date: undefined,
  }))
}

export function mapExpenseReport(payload: ExpensesApiPayload | undefined): ExpenseReportItem[] {
  if (!payload) return []

  return payload.byCategory.map((row) => ({
    id: row.category,
    category: row.category,
    totalExpense: row.total,
    amount: row.amount,
    percentage: wholePercent(row.amount, payload.totalAmount),
    paymentMethod: undefined,
    date: undefined,
  }))
}

export function mapIncomeReport(payload: IncomesApiPayload | undefined): IncomeReportItem[] {
  if (!payload) return []

  return payload.byCategory.map((row) => ({
    id: row.category,
    category: row.category,
    totalIncome: row.total,
    amount: row.amount,
    percentage: wholePercent(row.amount, payload.totalAmount),
    paymentMethod: undefined,
    date: undefined,
  }))
}

export function mapSupplierReport(payload: SuppliersApiPayload | undefined): SupplierReportItem[] {
  if (!payload) return []

  return payload.suppliers.map((row) => ({
    id: row.supplierId,
    supplierId: row.supplierId,
    supplierName: row.supplier,
    date: '',
    category: '',
    purchaseItem: '',
    qty: 0,
    amount: row.amount,
    totalPurchased: row.amount,
    totalPaid: row.paid,
    balanceDue: row.due,
    status: row.due > 0 ? 'Unpaid' : 'Received',
    avgLeadTime: '',
    totalTransactions: row.totalPurchases,
    history: undefined,
  }))
}

export function mapSupplierDueReport(payload: SupplierDuesApiPayload | undefined): SupplierDueReportItem[] {
  if (!payload) return []

  return payload.suppliers.map((row) => ({
    id: row.supplierId,
    supplierId: row.supplierId,
    supplierName: row.supplier,
    date: '',
    purchasesDue: row.totalPurchases,
    amountDue: row.due,
    daysDue: 0,
    status: 'Unpaid',
    avgLeadTime: '',
    history: undefined,
  }))
}

export function mapCustomerReport(payload: CustomersApiPayload | undefined): CustomerReportItem[] {
  if (!payload) return []

  return payload.topCustomers.map((row) => ({
    id: row.customerId,
    customerId: row.customerId,
    customerName: row.customer ?? 'Tanpa Nama',
    totalOrder: 0,
    amount: row.totalSales,
    totalSpent: row.totalSales,
    totalPaid: 0,
    balanceDue: 0,
    avgLeadTime: '',
    status: 'Received',
    date: undefined,
    history: undefined,
  }))
}

export function mapCustomerDueReport(payload: CustomerDuesApiPayload | undefined): CustomerDueReportItem[] {
  if (!payload) return []

  return payload.customers.map((row) => ({
    id: row.customerId,
    customerId: row.customerId,
    customerName: row.customer ?? 'Tanpa Nama',
    orderDue: row.due,
    amountDue: row.due,
    daysDue: 0,
    status: 'Unpaid',
    date: undefined,
    history: undefined,
  }))
}