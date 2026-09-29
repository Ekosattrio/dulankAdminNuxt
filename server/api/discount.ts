import { discounts } from '../data/discount'

// GET /api/discount — data mock discounts
export default defineEventHandler(() => {
  return discounts
})
