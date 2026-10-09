export interface POSProduct {
  id: string
  code: string
  name: string
  category: string
  price: number
  stock: number
  image: string
  specs?: string
}

export interface CartItem {
  id: string
  productId: string
  code: string
  name: string
  category: string
  price: number
  qty: number
  specs: string
  jobTitle: string
}

export interface POSCustomer {
  name: string
  phone: string
  email: string
  address: string
}
export interface POSCategory {
  id: string
  name: string
  count: number
  icon: string
}
export type POSPaymentMethod = 'cash' | 'card' | 'bank' | 'qris'
export interface HeldOrder {
  id: string
  ref: string
  total: number
  time: string
  items: CartItem[]
  customer: POSCustomer
  discount: number
  shipping: number
  taxRate: number
}
export interface POSReceipt {
  saleNo: string
  items: CartItem[]
  customer: POSCustomer
  total: number
  paid: number
  change: number
  method: POSPaymentMethod
}
