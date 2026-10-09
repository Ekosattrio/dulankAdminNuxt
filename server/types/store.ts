export interface Store {
  id: string
  storeName: string
  userName: string
  address: string
  phone: string
  email: string
  status: 'Active' | 'Inactive'
}

export interface StoreFilterParams {
  search?: string
  status?: string
}

export interface StoreFormData {
  id?: string
  storeName: string
  userName: string
  address: string
  phone: string
  email: string
  status: 'Active' | 'Inactive'
}

