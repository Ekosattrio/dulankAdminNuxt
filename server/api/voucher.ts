import { coupons } from '../data/voucher'

// GET /api/voucher — data mock coupons
export default defineEventHandler(() => {
  return coupons
})
