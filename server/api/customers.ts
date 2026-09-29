import { customers } from '../data/customers'

// GET /api/customers — data mock customers
export default defineEventHandler(() => {
  return customers
})
