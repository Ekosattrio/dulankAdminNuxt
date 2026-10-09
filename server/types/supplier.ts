export interface Supplier {
  id: string
  supplierId: string
  name: string
  email: string
  contact: string
  picName: string
  status: string
  date: string
}

export interface SupplierFilterParams {
  search?: string
  status?: string
}

export interface SupplierFormData {
  id?: string
  supplierId?: string
  name: string
  email: string
  contact: string
  picName: string
  status?: string
}

