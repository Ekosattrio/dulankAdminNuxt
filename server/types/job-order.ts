export interface JobOrderStep {
  name: string
  status: 'done' | 'active' | 'pending'
}

export interface JobOrder {
  id: string
  no: string
  orderId?: string
  customerId?: string
  branchId?: string
  productId?: string
  flowId?: string
  flowType?: 'In-House' | 'Outsource' | string
  dueDate: string
  customer: string
  product: string
  jobTitle: string
  qty?: number | string
  priority: 'High' | 'Medium' | 'Low' | 'Urgent' | string
  status: 'Waiting' | 'On Process' | 'Completed' | string
  workflowType: string
  workflowCategory: 'Design' | 'Pracetak' | 'Cetak' | 'Finishing' | string
  salesNo: string
  salesDate: string
  shipping: string
  orderSummary: string
  assignedTo?: string
  inputSpecs?: Record<string, any>
  outputSpecs?: Record<string, any>
  steps: JobOrderStep[]
}

export interface JobOrderFilterParams {
  search?: string
  status?: string
  priority?: string
  workflowCategory?: string
  workflowType?: string
}

export interface JobOrderFormData {
  id?: string
  no?: string
  orderId?: string
  customerId?: string
  productId?: string
  dueDate: string
  customer: string
  product: string
  jobTitle: string
  qty?: number | string
  priority: 'High' | 'Medium' | 'Low' | 'Urgent' | string
  status: 'Waiting' | 'On Process' | 'Completed' | string
  workflowType?: string
  workflowCategory: 'Design' | 'Pracetak' | 'Cetak' | 'Finishing' | string
  salesNo?: string
  shipping?: string
  orderSummary?: string
}
