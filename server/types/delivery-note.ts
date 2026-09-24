export interface DNItemRow {
  description: string
  qty: number
  unit: string
  packingQty: string
  weight: string
}

export interface DeliveryNote {
  id: string
  dnNo: string
  date: string
  customer: string
  noSales: string
  shippingAddress: string
  status: 'Complete' | 'Pending' | 'Ordered' | 'Received'
  dateStatus: string
  po: string
  shippingBy: string
  reference: string
  items: DNItemRow[]
}

export interface DeliveryNoteFilterParams {
  search?: string
  status?: string
}

export interface DeliveryNoteFormData {
  id?: string
  dnNo?: string
  customer: string
  noSales: string
  shippingAddress: string
  status: 'Complete' | 'Pending' | 'Ordered' | 'Received'
  po: string
  shippingBy: string
  reference: string
  items?: DNItemRow[]
}

