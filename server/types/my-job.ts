export type JobPriority = 'urgent' | 'high' | 'normal'
export type JobStatus = 'Waiting' | 'On Process' | 'Complete' | 'Hold'

export interface MyJob {
  id: string
  jobOrderId?: string
  orderId?: string
  customerId?: string
  branchId?: string
  productId?: string
  employeeId?: string
  flowName: string
  priority: JobPriority
  product: string
  title: string
  description: string
  status: JobStatus
  salesDate?: string
  noSales?: string
  customer?: string
  orderSummary?: string
  assignedTo?: string
  dueDate?: string
  kertas?: string
  sisiCetak?: string
  panjangKertas?: string
  lebarKertas?: string
  katerModel?: string
  jumlahPlat?: string
  jumlahBahan?: string
  jumlahInsit?: string
  jumlahButuh?: string
  adaContoh?: string
  accWarna?: string
  keterangan?: string
  qtyOk?: number | string
  qtyRusak?: number | string
}

export interface MyJobFilterParams {
  search?: string
  priority?: string
  status?: string
}

export interface MyJobFormData {
  id?: string
  jobOrderId?: string
  orderId?: string
  customerId?: string
  branchId?: string
  productId?: string
  employeeId?: string
  flowName: string
  priority: JobPriority
  product: string
  title: string
  description: string
  status: JobStatus
  salesDate?: string
  noSales?: string
  customer?: string
  orderSummary?: string
  assignedTo?: string
  dueDate?: string
  kertas?: string
  sisiCetak?: string
  panjangKertas?: string
  lebarKertas?: string
  katerModel?: string
  jumlahPlat?: string
  jumlahBahan?: string
  jumlahInsit?: string
  jumlahButuh?: string
  adaContoh?: string
  accWarna?: string
  keterangan?: string
  qtyOk?: number | string
  qtyRusak?: number | string
}

export interface MyJobStatusUpdatePayload {
  status: JobStatus
  qtyOk?: number | string
  qtyRusak?: number | string
}
