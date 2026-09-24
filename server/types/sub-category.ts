export interface SubCategory {
  id: string
  name: string
  category: string
  categoryCode: string
  description: string
  itemUsed: number
  createdBy: string
  status: 'Active' | 'Inactive'
}

export interface SubCategoryFilterParams {
  search?: string
  category?: string
  status?: string
}

export interface SubCategoryFormData {
  id?: string
  name: string
  category: string
  categoryCode?: string
  description?: string
  status?: 'Active' | 'Inactive'
}

