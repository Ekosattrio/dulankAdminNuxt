// finance.ts — type/interface untuk domain finance (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface BankAccount {
  id?: number
  bankName: string
  accountNo: string
  holderName: string
  branch: string
  isDefault: boolean
  createdOn: string
}

export interface BankAccountGrid {
  id?: number
  bankName: string
  accountNo: string
  holderName: string
  branch?: string
  isDefault: boolean
}

export interface CashAdvanceItem {
  id: string
  employee: string
  date: string
  tenorTotal: number
  tenorRemain: number
  totalCash: number
  period: 'Daily' | 'Weekly' | 'Monthly'
  note?: string
  status: 'On' | 'Close'
  history: Array<{
    date: string
    amount: number
    installment: number
    period: string
    tenor: string
    note: string
    status: 'On' | 'Close'
  }>
  payments: Array<{
    date: string
    payment: number
  }>
}

export interface CurrencyItem {
  id?: number
  name: string
  code: string
  symbol: string
  exchangeRate: string
  createdOn: string
}

export interface IncomeCategory {
  id: number
  no: string
  name: string
  description: string
  status: 'Active' | 'Inactive'
  created: string
}

export interface IncomeRecord {
  id: number
  date: string
  no: string
  name: string
  category: string
  notes: string
  amount: number
  paymentMethod?: string
  bankAccount?: string
  isCancelled?: boolean
}

export interface InflowRecord {
  id: number;
  date: string;
  refNo: string;
  name: string;
  source: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Partial" | "Unpaid";
  method: string;
  note: string;
}

export interface InputTaxItem {
  id: number
  purchaseNo: string
  invoiceDate: string
  fakturNo: string
  supplierName: string
  dpp: number
  vat: number
  credited: 'Yes' | 'No'
}

export interface OutflowRecord {
  id: number;
  date: string;
  refNo: string;
  name: string;
  source: string;
  amount: number;
  status: "Paid" | "Partial" | "Unpaid";
  method: string;
  note: string;
}

export interface OutputTaxItem {
  id: number;
  salesNo: string;
  etaxDate: string;
  etaxNumber: string;
  customerName: string;
  dpp: number;
  vat: number;
  txCode: string;
  total: number;
  status: "Issued" | "Draft" | "Cancelled";
}

export interface PaymentRecord {
  id: number;
  date: string;
  refNo: string;
  name: string;
  type: "Payment-In" | "Payment-Out";
  method: "Cash" | "Transfer";
  amount: number;
  status: string;
  created: string;
}

export interface TaxRateItem {
  id: number;
  name: string;
  rate: number;
  createdOn: string;
  status: "Active" | "Inactive";
}

export interface TransferRecord {
  id: number;
  date: string;
  no: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  description: string;
  createdBy: string;
}
export 
interface BillingItem {
  id: number
  billingId: string
  txId: string
  userEmail: string
  date: string
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  status: 'Berhasil' | 'Gagal'
  method: string
}

