export interface LargeFormatProduct {
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
  price: number // Harga per m² (IDR)
  minPrice: number // Minimal harga cetak (IDR)
  minOrderQty: number // Minimal kuantitas order (m²)
  minLength?: number // Minimal panjang dalam cm
  minWidth?: number // Minimal lebar dalam cm
  material?: string // Bahan / media cetak
  machineType?: string // Mesin / teknologi cetak
  priceType: 'Large Format'
  status: 'Active' | 'Inactive'
  created: string
  createdAt?: string
  updatedAt?: string
  description?: string
  images?: string[]
}

export interface LargeFormatFilterParams {
  search?: string
  category?: string
  status?: string
}

export interface LargeFormatFormData {
  id?: string
  code?: string
  name: string
  categoryId?: string
  category: string
  subCategoryId?: string
  subCategory: string
  unitId?: string
  unit: string
  price: number
  minPrice: number
  minOrderQty: number
  minLength?: number
  minWidth?: number
  material?: string
  machineType?: string
  priceType: 'Large Format'
  status?: 'Active' | 'Inactive'
  description?: string
}

