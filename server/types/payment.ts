export type PaymentType = 'Payment-In' | 'Payment-Out'
export type PaymentMethod = 'Cash' | 'Transfer'
export type PaymentStatus = 'Paid' | 'Partial'

export interface PaymentRecord {
  id: string
  date: string
  refNo: string
  name: string
  type: PaymentType
  method: PaymentMethod
  amount: number
  status: PaymentStatus
  created: string
}

export interface PaymentFilterParams {
  search?: string
  date?: string
  startDate?: string
  endDate?: string
  type?: string
  method?: string
}
