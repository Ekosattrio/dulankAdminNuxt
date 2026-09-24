export interface Product {
  id: string
  code: string
  name: string
  category: string
  subCategory: string
  unit: string
  price: number
  priceType: string
  created: string
  status: 'Active' | 'Inactive'
}

export interface ProductFilterParams {
  search?: string
  category?: string
  status?: string
}

export interface ProductFormData {
  id?: string
  code?: string
  name: string
  category: string
  subCategory: string
  unit: string
  price: number
  priceType: string
  status?: 'Active' | 'Inactive'
}

