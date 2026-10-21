export interface Store {
  id: string
  photo?: string | null
  storeName: string
  managerId?: string | null
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
  photo?: string | null
  storeName: string
  managerId?: string | null
  userName: string
  address: string
  phone: string
  email: string
  status: 'Active' | 'Inactive'
}

