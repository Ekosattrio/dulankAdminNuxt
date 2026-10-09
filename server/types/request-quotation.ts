export interface RFQItem {
  id: string
  noRequest: string
  customer: string
  email: string
  telp: string
  date: string
  status: 'Ordered' | 'Complete' | 'Pending' | 'Received'
  document?: RFQDocument
}

export interface RFQLineItem {
  description: string
  quantity: number
  unit: string
  eta: string
}
export interface RFQDocument {
  to: string
  rfqNo: string
  att: string
  date: string
  telp: string
  email: string
  dueDate: string
  paymentTerm: string
  items: RFQLineItem[]
  requestedTo?: { department: string; attn: string; email: string; telp: string }[]
  signature?: string
}
