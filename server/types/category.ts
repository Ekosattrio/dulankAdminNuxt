export interface Category {
  id: string
  name: string
  code: string
  createdDate: string
  createdBy: string
  status: 'Active' | 'Inactive'
}

export interface CategoryFilterParams {
  search?: string
  status?: string
}

export interface CategoryFormData {
  id?: string
  name: string
  code?: string
  status: 'Active' | 'Inactive'
}

