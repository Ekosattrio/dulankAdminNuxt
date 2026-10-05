export interface SalaryAllowanceItem {
  id: string
  name: string
  amount: number
}

export interface EmployeeSalaryItem {
  id: string
  employeeId: string
  name: string
  salary: number
  system: 'Monthly' | 'Weekly' | 'Daily'
  allowanceTotal: number
  overtimeRate: number
  status: 'Active' | 'Disabled'
  allowances: SalaryAllowanceItem[]
}

export interface EmployeeSalaryFilterParams {
  search?: string
  system?: string
  status?: string
}

export interface EmployeeSalaryFormData {
  id?: string
  employeeId: string
  name: string
  salary: number
  system: 'Monthly' | 'Weekly' | 'Daily'
  allowanceTotal?: number
  overtimeRate: number
  status: 'Active' | 'Disabled'
  allowances: SalaryAllowanceItem[]
}
