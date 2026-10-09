import type { SalesContact, SalesShipping } from './sales-document'
export interface QuotationLineItem {
  productName: string
  description: string
  moq: number
  unitPrice: number
  order: number
  unit: string
  amount: number
}
export interface QuotationDocument {
  contact: SalesContact
  shipping: SalesShipping
  date: string
  currency: string
  top: string
  att: string
  items: QuotationLineItem[]
  terms: string[]
  shippingCost: number
  taxRate: number
  pricesIncludeTax: boolean
  signature: string
  position?: string
  legacyTotal?: number
}
export interface Quotation {
  id: string
  noQuotation: string
  date: string
  customer: string
  email: string
  status: 'Send' | 'Ordered' | 'Rejected' | 'Complete' | 'Pending'
  dateStatus: string
  total: number
  channel: 'Online' | 'Sales Staff' | 'Offline'
  dueDate: string
  document?: QuotationDocument
}

export interface QuotationFilterParams {
  search?: string
  status?: string
}

export interface QuotationFormData {
  id?: string
  noQuotation?: string
  customer: string
  email: string
  status: 'Send' | 'Ordered' | 'Rejected' | 'Complete' | 'Pending'
  total: number
  channel: 'Online' | 'Sales Staff' | 'Offline'
  dueDate: string
  document?: QuotationDocument
}
