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
}

