import { orders } from '../data/pos-order'

// GET /api/pos-order — data mock orders
export default defineEventHandler(() => {
  return orders
})
