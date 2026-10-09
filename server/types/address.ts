export interface AddressStats {
  totalAddress: number
  totalProvince: number
  totalCity: number
  totalPosCode: number
}

export interface CustomerAddress {
  id: string
  customerId: string
  name: string
  contact: string
  province: string
  city: string
  district: string
  detailAddress: string
  otherDetail: string
  status: string
  date: string
}

export interface SupplierAddress {
  id: string
  userId: string
  user: string
  phone: string
  fullAddress: string
  district: string
  city: string
  province: string
  postalCode: string
  channel: string
  dateAdded: string
  status: string
  name?: string
  contact?: string
  detailAddress?: string
  date?: string
  otherDetail?: string
  supplierId?: string
}

export interface AddressFilterParams {
  search?: string
  status?: string
}

export interface AddressResponse {
  stats?: AddressStats
  customers: CustomerAddress[]
  suppliers: SupplierAddress[]
  totalCustomers: number
  totalSuppliers: number
}

export interface AddressFormData {
  id?: string
  customerId: string
  name: string
  contact?: string
  province?: string
  city?: string
  district?: string
  detailAddress?: string
  otherDetail?: string
  status?: string
  type?: 'customer' | 'supplier'
}
