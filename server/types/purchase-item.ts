export interface PurchaseItem {
  id: string
  category: string
  product: string
  description?: string
  merk?: string
  price: number
  unit: string
  created: string
}

export interface PurchaseItemFilterParams {
  search?: string
  category?: string
}

export interface PurchaseItemFormData {
  id?: string
  category: string
  product: string
  description?: string
  merk?: string
  price: number
  unit: string
}
