import { prices } from '../data/kertas-harga'

// GET /api/kertas-harga — data mock prices
export default defineEventHandler(() => {
  return prices
})
