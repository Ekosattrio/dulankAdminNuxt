export interface SalesContact {
  name: string
  phone: string
  email: string
  address: string
}
export interface SalesShipping {
  method: 'Shipping' | 'Pick Up'
  recipient: string
  phone: string
  address: string
  pickup: string
  deliveryAddress?: string
  deliveryPhone?: string
  pickupAddress?: string
  pickupPhone?: string
}
export interface SalesDocument {
  contact: SalesContact
  shipping: SalesShipping
  po: string
  notes: string
  voucher: string
  taxRate: number
}
export interface SalesPayment {
  id: string
  date: string
  created: string
  amount: number
  method: string
  notes: string
}
export interface SalesHistoryEntry {
  id: string
  saleId: string
  saleNo: string
  customer: string
  date: string
  total: number
  created: string
  kind: 'deleted' | 'cancelled'
}
