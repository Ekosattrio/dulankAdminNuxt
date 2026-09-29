import { orders } from '../data/orders'

// GET /api/orders — data mock orders
export default defineEventHandler(() => {
  return orders
})
