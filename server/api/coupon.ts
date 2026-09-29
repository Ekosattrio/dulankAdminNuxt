import { coupons } from '../data/coupon'

// GET /api/coupon — data mock coupons
export default defineEventHandler(() => {
  return coupons
})
