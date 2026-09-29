import { prices } from '../data/kertas-harga-self'

// GET /api/kertas-harga-self — data mock prices
export default defineEventHandler(() => {
  return prices
})
