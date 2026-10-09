export type OrderStatus = 'Complete' | 'Waiting' | 'Processing' | 'Cancel'
export type ShippingMethod = 'Pickup' | 'Courier' | 'Express'
export type SalesChannel = 'Quotation' | 'Website' | 'POS'

export interface OrderItem {
  productId: string
  productName: string
  qty: number
  unitPrice: number
  total: number
}

export interface Order {
  id: string
  no: string
  customerId?: string
  branchId?: string
  customer: string
  orderDate: string
  status: OrderStatus
  statusBy: string
  salesChannel: SalesChannel | string
  shipping: ShippingMethod | string
  items?: OrderItem[]
  totalAmount?: number
}

export interface OrderStats {
  totalOrders: number
  totalCustomers: number
  totalComplete: number
  totalCancel: number
}

export interface OrderFilterParams {
  search?: string
  shipping?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface OrderFormData {
  id?: string
  no?: string
  customer?: string
  orderDate?: string
  status?: OrderStatus
  statusBy?: string
  salesChannel?: string
  shipping?: string
}
