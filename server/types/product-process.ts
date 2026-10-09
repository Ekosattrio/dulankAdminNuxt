export interface ProductProcessItem {
  id: string
  productId: string
  code: string
  product: string
  image: string
  processName: string
  createDate: string
  status: 'Active' | 'Deactive'
  createdAt?: string
  updatedAt?: string
}

export interface ProductProcessFormData {
  id?: string
  productId: string
  code?: string
  product?: string
  image?: string
  processName: string
  status?: 'Active' | 'Deactive'
}

export interface ProductProcessFilterParams {
  search?: string
  processName?: string
  status?: string
}

