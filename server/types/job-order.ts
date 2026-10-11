export interface JobOrderStep {
  id?: string
  name: string
  status: 'done' | 'active' | 'pending'
  flowType?: 'In-House' | 'Branch Store' | 'Outsource' | string
  branch?: string
  expenseName?: string
  assignees?: string
  incentive?: number
  incentiveUnit?: 'Job' | 'Kg' | 'Lembar' | 'Rim' | 'Meter' | 'Pcs' | string
  infoList?: JobOrderInfoItem[]
  afterInfoList?: JobOrderInfoItem[]
}

export interface JobOrderInfoItem {
  id: string
  label: string
  value?: string
  inputType?: 'Input Type' | 'Select Type' | string
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
  description?: string
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
  description?: string
  qty?: number | string
  priority: 'High' | 'Medium' | 'Low' | 'Urgent' | string
  status: 'Waiting' | 'On Process' | 'Completed' | string
  workflowType?: string
  workflowCategory: 'Design' | 'Pracetak' | 'Cetak' | 'Finishing' | string
  salesNo?: string
  shipping?: string
  orderSummary?: string
  branchId?: string
  assignedTo?: string
  inputSpecs?: Record<string, unknown>
  outputSpecs?: Record<string, unknown>
  steps?: JobOrderStep[]
}

export interface JobOrderContext {
  jobOrder: JobOrder | null
  order: import('./order').Order | null
}
