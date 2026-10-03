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
  category: string
  subCategory: string
  unit: string
  price: number
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
