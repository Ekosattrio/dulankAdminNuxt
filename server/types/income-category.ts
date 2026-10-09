export interface IncomeCategoryItem {
  id: string
  no: string
  name: string
  description: string
  status: 'Active' | 'Inactive'
  created: string
  createdAt?: string
  updatedAt?: string
}

export interface IncomeCategoryFormData {
  id?: string
  name: string
  description: string
  status?: 'Active' | 'Inactive'
}

export interface IncomeCategoryFilterParams {
  search?: string
  status?: string
}

