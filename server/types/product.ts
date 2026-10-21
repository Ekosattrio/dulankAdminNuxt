export type ProductType = 'Single Product' | 'Variable Product' | 'Size Calculation' | 'Minimum Qty or Price' | 'Large Format' | 'Offset Service Price'

export interface ProductVariant {
  id: string
  variation: string
  value: string
  quantity: number
  price: number
  checked?: boolean
}

export interface Product {
  id: string
  code: string
  name: string
  categoryId: string
  category: string
  subCategoryId: string
  subCategory: string
  unitId: string
  unit: string
  storeId: string
  price: number
  productType?: ProductType | null
  priceType: string
  created: string
  status: 'Active' | 'Inactive'
  store?: string
  sellingType?: string
  description?: string
  quantity?: number
  minOrderQty?: number
  discountType?: string
  discountValue?: number
  taxType?: string
  quantityAlert?: number
  minPrice?: number
  druckPrice?: number
  minLength?: number
  minWidth?: number
  images?: string[]
  variants?: ProductVariant[]
  createdAt?: string
  updatedAt?: string
  archivedAt?: string | null
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
  categoryId?: string
  category: string
  subCategoryId?: string
  subCategory: string
  unitId?: string
  unit: string
  storeId?: string
  price: number
  productType?: ProductType | null
  priceType: string
  status?: 'Active' | 'Inactive'
  store?: string
  sellingType?: string
  description?: string
  quantity?: number
  minOrderQty?: number
  discountType?: string
  discountValue?: number
  taxType?: string
  quantityAlert?: number
  minPrice?: number
  druckPrice?: number
  minLength?: number
  minWidth?: number
  images?: string[]
  variants?: ProductVariant[]
}

export interface ProductImportRow {
  code?: string
  name: string
  category: string
  subCategory: string
  unit: string
  price: number
  productType?: ProductType | null
  priceType: string
}
