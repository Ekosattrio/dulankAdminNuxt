export interface CalculatorDashboardUser {
  id: number
  userId: string
  user: string
  calculate: number
  request: number
  usage: number
  status: 'Active' | 'Disabled'
  role: string
  lastActive: string
  departmentId: string
  employeeId: string
  createdAt: string
  updatedAt: string
}

export interface CalculatorDashboardTelemetry {
  currentUsers: number
  totalRequest: number
  totalCalculate: number
  requestGrowth: string
  calculateGrowth: string
  chart: {
    labels: string[]
    thisWeek: number[]
    lastWeek: number[]
  }
}

export interface CalculatorDashboardData {
  telemetry: CalculatorDashboardTelemetry
  users: CalculatorDashboardUser[]
}

export interface CalculatorDashboardUserUpdate {
  user?: string
  calculate?: number
  request?: number
  usage?: number
  status?: CalculatorDashboardUser['status']
}

export interface CalculatorDashboardResponse {
  success: boolean
  data: CalculatorDashboardData
  message?: string
}

