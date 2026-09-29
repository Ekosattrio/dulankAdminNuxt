import { carts } from '../data/cart'

// GET /api/cart — data mock carts
export default defineEventHandler(() => {
  return carts
})
