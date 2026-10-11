export type DiscountType = 'Fixed' | 'Percentage'
export type DiscountStatus = 'Active' | 'Inactive'

export interface DiscountItem {
  id: string
  planId: string | null
  plan: string | null
  name: string
  value: number
  type: DiscountType
  validFrom: string | null
  validTill: string | null
  used: number
  status: DiscountStatus
}

export interface DiscountFormData {
  id?: string
  planId?: string | null
  plan?: string | null
  name: string
  value: number
  type: DiscountType
  validFrom?: string | null
  validTill?: string | null
  status?: DiscountStatus
}

export interface DiscountQuery {
  search?: string
  plan?: string
  status?: string
}