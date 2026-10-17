import type { ProductVariant } from './product'

export interface VariableProductItem {
  id: string
  code: string
  name: string
  categoryId: string
  category: string
  subCategoryId: string
  subCategory: string
  unitId: string
  unit: string
  storeId?: string
  store?: string
  attributeName: string
  variants: ProductVariant[]
  priceMin: number
  priceMax: number
  totalStock: number
  priceType: 'Variable Product'
  status: 'Active' | 'Inactive'
  created: string
  createdAt?: string
  updatedAt?: string
  description?: string
  images?: string[]
}

export interface VariableProductFilterParams {
  search?: string
  category?: string
  attribute?: string
  status?: string
}

export interface VariableProductFormData {
  id?: string
  code?: string
  name: string
  categoryId?: string
  category: string
  subCategoryId?: string
  subCategory: string
  unitId?: string
  unit: string
  attributeName: string
  variants: ProductVariant[]
  priceType: 'Variable Product'
  status?: 'Active' | 'Inactive'
  description?: string
}

