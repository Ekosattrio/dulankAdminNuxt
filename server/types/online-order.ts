export interface OnlineOrderItem {
  id: string
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
  items?: {
    product: string
    qty: number
    price: number
    discount: number
    tax: number
    taxAmount: number
    unitCost: number
    totalCost: number
  }[]
  payments?: {
    date: string
    reference: string
    amount: number
    paidBy: string
  }[]
}

export interface OnlineOrderQuery {
  search?: string
  status?: string
  paymentStatus?: string
}

