export interface IncentiveItem {
  id: string
  code: string
  employee: string
  period: string
  qtyComplete: number
  totalAmount: number
  status: 'Paid' | 'Pending'
}

export interface IncentiveFilterParams {
  search?: string
  status?: string
}

export interface IncentiveFormData {
  id?: string
  code?: string
  employee: string
  period: string
  qtyComplete: number
  totalAmount: number
  status: 'Paid' | 'Pending'
}

