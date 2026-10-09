export interface PurchaseOrderItem {
  name: string
  qty: number
  unit: string
  price: number
}

export interface PurchaseOrder {
  id: string
  noPO: string
  date: string
  created: string
  noPurchase: string
  supplier: string
  amount: number
  poStatus: 'Sent' | 'Draft' | 'Cancel'
  goodsStatus: 'Scheduled' | 'Complete' | 'Cancel' | 'Pending'
  goodsDate: string
  goodsBy: string
  termOfPayment?: string
  deliveryDate?: string
  deliveryAddress?: string
  vendorReff?: string
  taxRate?: number
  items?: PurchaseOrderItem[]
}

export interface PurchaseOrderFilterParams {
  search?: string
  status?: string
  goodsStatus?: string
  startDate?: string
  endDate?: string
}

export interface PurchaseOrderFormData {
  id?: string
  noPO?: string
  date?: string
  created?: string
  noPurchase?: string
  supplier: string
  poStatus?: 'Sent' | 'Draft' | 'Cancel'
  goodsStatus?: 'Scheduled' | 'Complete' | 'Cancel' | 'Pending'
  goodsDate?: string
  goodsBy?: string
  termOfPayment?: string
  deliveryDate?: string
  deliveryAddress?: string
  vendorReff?: string
  taxRate?: number
  amount?: number
  items: PurchaseOrderItem[]
}
