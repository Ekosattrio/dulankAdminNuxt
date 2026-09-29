import { products, cart } from '../data/pos'

// GET /api/pos — data mock: products, cart
export default defineEventHandler(() => {
  return { products, cart }
})
