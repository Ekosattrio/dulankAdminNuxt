export interface WorkFlow {
  id: string
  no: string
  category: string
  product: string
  workflowSteps: string
}

export interface WorkFlowFilterParams {
  search?: string
  category?: string
}

export interface WorkFlowFormData {
  id?: string
  no?: string
  category: string
  product: string
  workflowSteps: string
}

