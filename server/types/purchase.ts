export interface PurchaseOrderItem {
  name: string
  qty: number
  unit: string
  price: number
}

export interface Purchase {
  id: string
  noPurchase: string
  date: string
  created: string
  supplier: string
  product: string
  status: 'Received' | 'Complete' | 'Ordered' | 'Pending'
  amount: number
  paid: number
  due: number
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial' | 'Refunded'
  notes?: string
  items?: PurchaseOrderItem[]
  shippingCost?: number
  tax?: number
}

export interface PurchaseFilterParams {
  search?: string
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
}

export interface PurchaseFormData {
  id?: string
  noPurchase?: string
  date?: string
  created?: string
  supplier: string
  status?: 'Received' | 'Complete' | 'Ordered' | 'Pending'
  paymentStatus?: 'Paid' | 'Unpaid' | 'Partial' | 'Refunded'
  notes?: string
  items: PurchaseOrderItem[]
  paid?: number
  shippingCost?: number
}
