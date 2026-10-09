export interface Invoice {
  id: string
  invoiceNo: string
  customer: string
  dueDate: string
  amount: number
  paid: number
  amountDue: number
  status: 'Paid' | 'Partial' | 'Unpaid'
}

export interface InvoiceFilterParams {
  search?: string
  status?: string
}

export interface InvoiceFormData {
  id?: string
  invoiceNo?: string
  customer: string
  dueDate: string
  amount: number
  paid: number
  status?: 'Paid' | 'Partial' | 'Unpaid'
}

