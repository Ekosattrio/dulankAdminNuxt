export type VoucherType = 'Fixed' | 'Percentage'
export type VoucherStatus = 'Active' | 'Inactive'
export interface VoucherOption { id: string; name: string }
export interface VoucherRecord {
  id: string
  storeId: string
  createdByEmployeeId: string
  productIds: string[]
  name: string
  code: string
  type: VoucherType
  discount: number
  limit: number
  used: number
  startDate: string
  endDate: string
  allProducts: boolean
  oncePerCustomer: boolean
  status: VoucherStatus
  createdAt: string
  updatedAt: string
}
export interface VoucherStore { stores: VoucherOption[]; products: VoucherOption[]; filterProducts: VoucherOption[]; records: VoucherRecord[] }
export interface VoucherMeta { stores: VoucherOption[]; products: VoucherOption[]; filterProducts: VoucherOption[]; names: string[] }
export interface VoucherQuery { search?: string; name?: string; type?: string; storeId?: string; productId?: string; startDate?: string; endDate?: string }
export interface VoucherCommand { name: string; code: string; type: VoucherType; discount: number; limit: number; startDate?: string; endDate?: string; allProducts: boolean; oncePerCustomer: boolean; productIds: string[]; status: VoucherStatus }
