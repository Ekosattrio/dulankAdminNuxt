export interface Coupon {
  id: string | number
  name: string
  code: string
  type: 'Fixed' | 'Percentage'
  discount: number
  limit: number
  used: number
  valid: string
  status: 'Active' | 'Inactive'
  createdAt?: string
}

export type CouponFormData = Omit<Coupon, 'id' | 'used'> & {
  id?: string | number
  used?: number
}

export interface Voucher {
  id: string | number
  name: string
  code: string
  type: 'Fixed' | 'Percentage'
  discount: number
  limit: number
  used: number
  valid: string
  status: 'Active' | 'Inactive'
  createdAt?: string
}

export type VoucherFormData = Omit<Voucher, 'id' | 'used'> & {
  id?: string | number
  used?: number
}

export interface DiscountPlan {
  id: string
  planName: string
  customers: string
  status: 'Active' | 'Inactive'
  createdAt?: string
}

export type DiscountPlanFormData = Omit<DiscountPlan, 'id'> & {
  id?: string
}

export interface Discount {
  id: string
  name: string
  value: number
  type: 'Percentage' | 'Flat'
  discountPlanId?: string
  discountPlanName: string
  validFrom: string
  validTill: string
  days: string[]
  products: string
  used: number
  status: 'Active' | 'Inactive'
  createdAt?: string
}

export type DiscountFormData = Omit<Discount, 'id' | 'used'> & {
  id?: string
  used?: number
}

