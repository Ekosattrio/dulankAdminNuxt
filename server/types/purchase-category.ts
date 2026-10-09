export interface PurchaseCategory {
  id: string
  name: string
  created: string
  status: 'Active' | 'Deactive'
  itemCount?: number
}

export interface PurchaseCategoryFilterParams {
  search?: string
  status?: string
}

export interface PurchaseCategoryFormData {
  id?: string
  name: string
  status: 'Active' | 'Deactive'
}
