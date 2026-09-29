import { payments } from '../data/payments'

// GET /api/payments — data mock payments
export default defineEventHandler(() => {
  return payments
})
