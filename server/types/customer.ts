export interface Customer {
  id: string
  customerId: string
  name: string
  email: string
  type: string
  balance: number
  phone: string
  channel: string
  dateJoin: string
  lastSeen: string
  status?: string
}

export interface CustomerFilterParams {
  search?: string
  type?: string
  channel?: string
}

export interface CustomerFormData {
  id?: string
  customerId?: string
  name: string
  email: string
  type: string
  phone: string
  balance?: number
  channel?: string
}

