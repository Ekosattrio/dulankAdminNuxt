export interface OnlineOrder {
  id: number | string
  customer: string
  avatar: string
  reference: string
  date: string
  status: 'Complete' | 'Pending'
  grandTotal: number
  paid: number
  due: number
  paymentStatus: 'Paid' | 'Unpaid'
  biller: string
  channel?: string
  paymentMethod?: string
}

export interface OnlineOrderFormData {
  customer: string
  avatar?: string
  reference?: string
  date?: string
  status?: 'Complete' | 'Pending'
  grandTotal: number
  paid?: number
  due?: number
  paymentStatus?: 'Paid' | 'Unpaid'
  biller?: string
  channel?: string
  paymentMethod?: string
}

