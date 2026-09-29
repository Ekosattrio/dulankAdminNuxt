import { products } from '../data/cetak-full-color'

// GET /api/cetak-full-color — data mock products
export default defineEventHandler(() => {
  return products
})
