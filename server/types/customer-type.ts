export interface CustomerType {
  id: string
  name: string
  status: 'Active' | 'Inactive'
}

export interface CustomerTypeFilterParams {
  search?: string
  status?: string
}

export interface CustomerTypeFormData {
  id?: string
  name: string
  status: 'Active' | 'Inactive'
}

