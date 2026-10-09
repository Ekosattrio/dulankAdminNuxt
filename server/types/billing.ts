export interface BillingItem {
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

export interface BillingStats {
  totalTransaction: number
  totalSuccess: number
  totalFailed: number
}

