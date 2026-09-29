import { products } from '../data/product-list'

// GET /api/product-list — data mock products
export default defineEventHandler(() => {
  return products
})
