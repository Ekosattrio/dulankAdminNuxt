export interface MyJob {
  id: string
  flowName: string
  priority: 'urgent' | 'high' | 'normal'
  product: string
  title: string
  description: string
  status: 'Waiting' | 'On Process' | 'Complete' | 'Hold'
  assignedTo?: string
  dueDate?: string
}

export interface MyJobFilterParams {
  search?: string
  priority?: string
  status?: string
}

export interface MyJobFormData {
  id?: string
  flowName: string
  priority: 'urgent' | 'high' | 'normal'
  product: string
  title: string
  description: string
  status: 'Waiting' | 'On Process' | 'Complete' | 'Hold'
  assignedTo?: string
  dueDate?: string
}

