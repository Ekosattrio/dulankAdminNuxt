export interface JobOrderStep {
  name: string
  status: 'done' | 'active' | 'pending'
}

export interface JobOrder {
  id: string
  no: string
  dueDate: string
  customer: string
  product: string
  jobTitle: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Waiting' | 'On Process' | 'Completed'
  workflowType: string
  workflowCategory: 'Design' | 'Pracetak' | 'Cetak' | 'Finishing'
  salesNo: string
  salesDate: string
  shipping: string
  orderSummary: string
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
  dueDate: string
  customer: string
  product: string
  jobTitle: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Waiting' | 'On Process' | 'Completed'
  workflowType?: string
  workflowCategory: 'Design' | 'Pracetak' | 'Cetak' | 'Finishing'
  salesNo?: string
  shipping?: string
  orderSummary?: string
}

