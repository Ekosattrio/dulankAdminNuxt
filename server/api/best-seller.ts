import { products } from '../data/best-seller'

// GET /api/best-seller — data mock products
export default defineEventHandler(() => {
  return products
})
