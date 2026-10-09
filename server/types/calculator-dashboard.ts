export interface CalculatorDashboardUser {
  id: number
  userId?: string
  user: string
  calculate: number
  request: number
  usage: number
  status: 'Active' | 'Disabled'
  role: string
  lastActive: string
  departmentId?: string
}

export interface CalculatorDashboardTelemetry {
  currentUsers: number
  totalRequest: number
  totalCalculate: number
  requestGrowth: string
  calculateGrowth: string
}

export interface CalculatorDashboardData {
  telemetry: CalculatorDashboardTelemetry
  users: CalculatorDashboardUser[]
}

export interface CalculatorDashboardResponse {
  success: boolean
  data: CalculatorDashboardData
  message?: string
}

