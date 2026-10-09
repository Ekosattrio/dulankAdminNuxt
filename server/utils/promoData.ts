import { readJSON, writeJSON } from './data'
import type {
  Coupon,
  CouponFormData,
  Voucher,
  VoucherFormData,
  DiscountPlan,
  DiscountPlanFormData,
  Discount,
  DiscountFormData
} from '#server/types/promo'

const COUPONS_FILE = 'coupons.json'
const VOUCHERS_FILE = 'vouchers.json'
const DISCOUNT_PLANS_FILE = 'discount-plans.json'
const DISCOUNTS_FILE = 'discounts.json'

// === COUPONS ===
export function getCouponsList(filter?: { search?: string; type?: string; status?: string }): Coupon[] {
  const all = readJSON<Coupon[]>(COUPONS_FILE, [])
  let filtered = [...all]

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim()
    filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
  }
  if (filter?.type) {
    filtered = filtered.filter(c => c.type === filter.type)
  }
  if (filter?.status) {
    filtered = filtered.filter(c => c.status === filter.status)
  }

  return filtered
}

export function saveCouponItem(payload: CouponFormData): Coupon {
  const all = readJSON<Coupon[]>(COUPONS_FILE, [])

  if (payload.id) {
    const idx = all.findIndex(c => String(c.id) === String(payload.id))
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Coupon not found' })
      const updated: Coupon = {
        ...current,
        name: payload.name.trim(),
        code: payload.code.trim().toUpperCase(),
        type: payload.type,
        discount: Number(payload.discount) || 0,
        limit: Number(payload.limit) || 0,
        valid: payload.valid,
        status: payload.status
      }
      all[idx] = updated
      writeJSON(COUPONS_FILE, all)
      return updated
    }
  }

  const newId = `CPN${String(all.length + 1).padStart(3, '0')}`
  const created: Coupon = {
    id: newId,
    name: payload.name.trim(),
    code: payload.code.trim().toUpperCase(),
    type: payload.type,
    discount: Number(payload.discount) || 0,
    limit: Number(payload.limit) || 0,
    used: 0,
    valid: payload.valid || new Date().toISOString().split('T')[0] || '',
    status: payload.status || 'Active',
    createdAt: new Date().toISOString()
  }

  all.unshift(created)
  writeJSON(COUPONS_FILE, all)
  return created
}

export function deleteCouponItem(id: string | number): boolean {
  const all = readJSON<Coupon[]>(COUPONS_FILE, [])
  const filtered = all.filter(c => String(c.id) !== String(id))
  if (filtered.length === all.length) return false
  writeJSON(COUPONS_FILE, filtered)
  return true
}

// === VOUCHERS ===
export function getVouchersList(filter?: { search?: string; type?: string; status?: string }): Voucher[] {
  const all = readJSON<Voucher[]>(VOUCHERS_FILE, [])
  let filtered = [...all]

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim()
    filtered = filtered.filter(v => v.name.toLowerCase().includes(q) || v.code.toLowerCase().includes(q))
  }
  if (filter?.type) {
    filtered = filtered.filter(v => v.type === filter.type)
  }
  if (filter?.status) {
    filtered = filtered.filter(v => v.status === filter.status)
  }

  return filtered
}

export function saveVoucherItem(payload: VoucherFormData): Voucher {
  const all = readJSON<Voucher[]>(VOUCHERS_FILE, [])

  if (payload.id) {
    const idx = all.findIndex(v => String(v.id) === String(payload.id))
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Voucher not found' })
      const updated: Voucher = {
        ...current,
        name: payload.name.trim(),
        code: payload.code.trim().toUpperCase(),
        type: payload.type,
        discount: Number(payload.discount) || 0,
        limit: Number(payload.limit) || 0,
        valid: payload.valid,
        status: payload.status
      }
      all[idx] = updated
      writeJSON(VOUCHERS_FILE, all)
      return updated
    }
  }

  const newId = `VCH${String(all.length + 1).padStart(3, '0')}`
  const created: Voucher = {
    id: newId,
    name: payload.name.trim(),
    code: payload.code.trim().toUpperCase(),
    type: payload.type,
    discount: Number(payload.discount) || 0,
    limit: Number(payload.limit) || 0,
    used: 0,
    valid: payload.valid || new Date().toISOString().split('T')[0] || '',
    status: payload.status || 'Active',
    createdAt: new Date().toISOString()
  }

  all.unshift(created)
  writeJSON(VOUCHERS_FILE, all)
  return created
}

export function deleteVoucherItem(id: string | number): boolean {
  const all = readJSON<Voucher[]>(VOUCHERS_FILE, [])
  const filtered = all.filter(v => String(v.id) !== String(id))
  if (filtered.length === all.length) return false
  writeJSON(VOUCHERS_FILE, filtered)
  return true
}

// === DISCOUNT PLANS ===
export function getDiscountPlansList(filter?: { search?: string; status?: string }): DiscountPlan[] {
  const all = readJSON<DiscountPlan[]>(DISCOUNT_PLANS_FILE, [])
  let filtered = [...all]

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim()
    filtered = filtered.filter(p => p.planName.toLowerCase().includes(q) || p.customers.toLowerCase().includes(q))
  }
  if (filter?.status) {
    filtered = filtered.filter(p => p.status === filter.status)
  }

  return filtered
}

export function saveDiscountPlanItem(payload: DiscountPlanFormData): DiscountPlan {
  const all = readJSON<DiscountPlan[]>(DISCOUNT_PLANS_FILE, [])

  if (payload.id) {
    const idx = all.findIndex(p => p.id === payload.id)
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Discount plan not found' })
      const updated: DiscountPlan = {
        ...current,
        planName: payload.planName.trim(),
        customers: payload.customers.trim(),
        status: payload.status
      }
      all[idx] = updated
      writeJSON(DISCOUNT_PLANS_FILE, all)
      return updated
    }
  }

  const newId = `DP${String(all.length + 1).padStart(3, '0')}`
  const created: DiscountPlan = {
    id: newId,
    planName: payload.planName.trim(),
    customers: payload.customers.trim() || 'All Customers',
    status: payload.status || 'Active',
    createdAt: new Date().toISOString()
  }

  all.unshift(created)
  writeJSON(DISCOUNT_PLANS_FILE, all)
  return created
}

export function deleteDiscountPlanItem(id: string): boolean {
  const all = readJSON<DiscountPlan[]>(DISCOUNT_PLANS_FILE, [])
  const filtered = all.filter(p => p.id !== id)
  if (filtered.length === all.length) return false
  writeJSON(DISCOUNT_PLANS_FILE, filtered)
  return true
}

// === DISCOUNTS ===
export function getDiscountsList(filter?: { search?: string; planId?: string; status?: string }): Discount[] {
  const all = readJSON<Discount[]>(DISCOUNTS_FILE, [])
  let filtered = [...all]

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim()
    filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.discountPlanName.toLowerCase().includes(q))
  }
  if (filter?.planId) {
    filtered = filtered.filter(d => d.discountPlanId === filter.planId)
  }
  if (filter?.status) {
    filtered = filtered.filter(d => d.status === filter.status)
  }

  return filtered
}

export function saveDiscountItem(payload: DiscountFormData): Discount {
  const all = readJSON<Discount[]>(DISCOUNTS_FILE, [])

  if (payload.id) {
    const idx = all.findIndex(d => d.id === payload.id)
    if (idx !== -1) {
      const current = all[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Discount not found' })
      const updated: Discount = {
        ...current,
        name: payload.name.trim(),
        value: Number(payload.value) || 0,
        type: payload.type,
        discountPlanId: payload.discountPlanId,
        discountPlanName: payload.discountPlanName || 'Standard Plan',
        validFrom: payload.validFrom,
        validTill: payload.validTill,
        days: Array.isArray(payload.days) ? payload.days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        products: payload.products || 'All Products',
        status: payload.status
      }
      all[idx] = updated
      writeJSON(DISCOUNTS_FILE, all)
      return updated
    }
  }

  const newId = `DSC${String(all.length + 1).padStart(3, '0')}`
  const created: Discount = {
    id: newId,
    name: payload.name.trim(),
    value: Number(payload.value) || 0,
    type: payload.type,
    discountPlanId: payload.discountPlanId || 'DP001',
    discountPlanName: payload.discountPlanName || 'Standard Plan',
    validFrom: payload.validFrom || new Date().toISOString().split('T')[0] || '',
    validTill: payload.validTill || new Date().toISOString().split('T')[0] || '',
    days: Array.isArray(payload.days) ? payload.days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    products: payload.products || 'All Products',
    used: 0,
    status: payload.status || 'Active',
    createdAt: new Date().toISOString()
  }

  all.unshift(created)
  writeJSON(DISCOUNTS_FILE, all)
  return created
}

export function deleteDiscountItem(id: string): boolean {
  const all = readJSON<Discount[]>(DISCOUNTS_FILE, [])
  const filtered = all.filter(d => d.id !== id)
  if (filtered.length === all.length) return false
  writeJSON(DISCOUNTS_FILE, filtered)
  return true
}

