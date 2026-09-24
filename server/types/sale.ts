export interface Sale {
  id: string
  saleNo: string
  customer: string
  date: string
  subTotal: number
  deliveryFee: number
  discount: number
  tax: number
  total: number
  delivery: 'Pick Up' | 'Shipping'
  channel: 'POS' | 'Website'
  status: 'Paid' | 'Unpaid' | 'Partial'
  method: 'Cash' | 'Bank Transfer' | 'Debit Card'
}

export interface SaleFilterParams {
  search?: string
  status?: string
  channel?: string
}

export interface SaleFormData {
  id?: string
  saleNo?: string
  customer: string
  subTotal: number
  deliveryFee?: number
  discount?: number
  tax?: number
  delivery?: 'Pick Up' | 'Shipping'
  channel?: 'POS' | 'Website'
  status?: 'Paid' | 'Unpaid' | 'Partial'
  method?: 'Cash' | 'Bank Transfer' | 'Debit Card'
}

