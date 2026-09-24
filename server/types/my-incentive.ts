export interface MyIncentive {
  id: string
  code: string
  process: string
  date: string
  qty: number
  amount: number
  status: 'Paid' | 'Pending'
}

export interface MyIncentiveFilterParams {
  search?: string
  process?: string
  status?: string
}

export interface MyIncentiveFormData {
  id?: string
  code?: string
  process: string
  date: string
  qty: number
  amount: number
  status: 'Paid' | 'Pending'
}

