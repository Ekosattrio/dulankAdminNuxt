export interface PurchaseReturnItem {
  name: string
  qty: number
  returnQty: number
  unit: string
  price: number
  amount: number
  reason?: string
}

export interface PurchaseReturn {
  id: string
  noPR: string
  date: string
  created: string
  noPurchase: string
  supplier: string
  amount: number
  paid: number
  due: number
  status: 'Refunded' | 'Cancel' | 'Ordered' | 'Received' | 'Pending'
  statusBy: string
  notes?: string
  items?: PurchaseReturnItem[]
}

export interface PurchaseReturnFilterParams {
  search?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface PurchaseReturnFormData {
  id?: string
  noPR?: string
  date?: string
  created?: string
  noPurchase: string
  supplier: string
  status?: 'Refunded' | 'Cancel' | 'Ordered' | 'Received' | 'Pending'
  statusBy?: string
  notes?: string
  items: PurchaseReturnItem[]
  paid?: number
}
