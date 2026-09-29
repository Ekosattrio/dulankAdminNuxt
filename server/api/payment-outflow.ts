import { outflows } from '../data/payment-outflow'

// GET /api/payment-outflow — data mock outflows
export default defineEventHandler(() => {
  return outflows
})
