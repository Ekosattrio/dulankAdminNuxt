export interface PayslipItem {
  id: string
  slipNo: string
  name: string
  period: string
  salaryRate: number
  dayWorked: number
  allowance: number
  overtime: number
  deduction: number
  total: number
  status: 'Paid' | 'Unpaid'
  paidDate: string
}

export interface PayslipFilterParams {
  search?: string
  status?: string
}

export interface PayslipFormData {
  id?: string
  slipNo?: string
  name: string
  period: string
  salaryRate: number
  dayWorked: number
  allowance: number
  overtime: number
  deduction: number
  total?: number
  status: 'Paid' | 'Unpaid'
  paidDate?: string
}

