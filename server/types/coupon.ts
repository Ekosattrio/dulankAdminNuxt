export type CouponType = 'Fixed' | 'Percentage'
export type CouponStatus = 'Active' | 'Inactive'

export interface CouponItem {
  id: string
  name: string
  code: string
  type: CouponType
  discount: number
  limit: number
  used: number
  valid: string
  validFrom?: string
  validUntil?: string
  status: CouponStatus
}

export interface CouponFormData {
  id?: string
  name: string
  code: string
  type: CouponType
  discount: number
  limit?: number | null
  validFrom?: string
  validUntil?: string
  status: CouponStatus
}

export interface CouponQuery {
  search?: string
  type?: string
  status?: string
}

