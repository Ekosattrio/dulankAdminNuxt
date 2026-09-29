import { orders } from '../data/online-orders'

// GET /api/online-orders — data mock orders
export default defineEventHandler(() => {
  return orders
})
