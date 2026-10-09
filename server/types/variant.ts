export interface Variant {
  id: string
  name: string
  values: string
  itemUsed: number
  createdOn: string
  status: 'Active' | 'Inactive'
}

export interface VariantFilterParams {
  search?: string
  status?: string
}

export interface VariantFormData {
  id?: string
  name: string
  values: string
  status?: 'Active' | 'Inactive'
}

