// customer.ts — type/interface untuk domain customer (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface Customer {
  name: string
  phone: string
  email: string
  address: string
}

export interface CustomerRecord {
  id: number
  customerId: string
  name: string
  email: string
  type: string
  balance: number
  phone: string
  channel: string
  dateJoin: string
  lastSeen: string
  address: string
}

export interface CustomerTypeItem {
  id: number
  name: string
  status: 'Active' | 'Inactive'
}

export interface SalesCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}
