export interface ReturnItem {
  name: string
  description: string
  qtyOrder: number
  qtyReturn: number
  unit: string
  price: number
  returnAmount: number
  reason: string
}

export interface SalesReturn {
  id: number
  returnNo: string
  date: string
  salesNo: string
  customer: string
  paymentStatus: 'Paid' | 'Unpaid'
  paymentDate: string
  paymentMethod: string
  total: number
  items: ReturnItem[]
  notes?: string
  payment?: ReturnPayment
}

export interface ReturnPayment {
  method: 'Cash' | 'Transfer'
  bankName: string
  accountNumber: string
  accountName: string
  amount: number
  notes: string
  reference?: string
}

export type SalesReturnFormData = Omit<SalesReturn, 'id' | 'returnNo' | 'paymentDate' | 'paymentMethod'> & {
  id?: number
}
