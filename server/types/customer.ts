export interface CustomerRecord {
  id: string
  customerId: string
  name: string
  email: string
  type: string
  phone: string
  channel: string
  dateJoin: string
  lastSeen: string
  status?: string
}

export interface Customer extends CustomerRecord {
  /** Computed output from customer account entries; never accepted from Add/Edit forms. */
  balance: number
}

export interface CustomerAccountEntry {
  id: string
  customerId: string
  sourceType: 'opening_balance' | 'sale' | 'payment' | 'adjustment'
  sourceId?: string
  amount: number
  occurredAt: string
  note?: string
}

export interface CustomerFilterParams {
  search?: string
  type?: string
  channel?: string
  startDate?: string
  endDate?: string
}

export interface CustomerFormData {
  id?: string
  customerId?: string
  name: string
  email: string
  type: string
  phone: string
}

