export interface MyIncentive {
  id: string
  code?: string
  jobOrderId?: string
  employeeId?: string
  branchId?: string
  date: string
  jobTitle: string
  flowName: string
  process: string
  incentive: number
  unit: string
  qty: number
  amount: number
  status: 'Paid' | 'Pending'
  employee?: string
}

export interface MyIncentiveFilterParams {
  search?: string
  process?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface MyIncentiveFormData {
  id?: string
  code?: string
  date: string
  jobTitle: string
  flowName: string
  process: string
  incentive: number
  unit: string
  qty: number
  amount?: number
  status: 'Paid' | 'Pending'
  employee?: string
}

export interface MyIncentiveStats {
  totalCount: number
  totalAmount: number
}
