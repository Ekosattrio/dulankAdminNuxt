export interface JobProgress {
  id: string
  progressCode: string
  jobOrderId: string
  orderId: string
  customerId: string
  branchId: string
  productId: string
  employeeId?: string
  product: string
  description: string
  process: string
  completedBy: string
  completedAt: string
  note: string
  isCompleted: boolean
  inputSpecs: Record<string, unknown>
  outputSpecs: Record<string, unknown>
  qtyOk: number
  qtyRusak: number
  createdAt: string
  updatedAt: string
}

export interface JobProgressFilters {
  search?: string
  process?: string
  startDate?: string
  endDate?: string
}

export interface JobProgressUpdate {
  isCompleted: boolean
  completedBy?: string
  employeeId?: string
  note?: string
  qtyOk?: number
  qtyRusak?: number
}

export interface JobProgressStats { total: number; completed: number; pending: number }
