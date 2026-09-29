import { inflows } from '../data/payment-inflow'

// GET /api/payment-inflow — data mock inflows
export default defineEventHandler(() => {
  return inflows
})
