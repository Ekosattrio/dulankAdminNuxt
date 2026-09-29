import { shops } from '../data/semua-toko-kertas'

// GET /api/semua-toko-kertas — data mock shops
export default defineEventHandler(() => {
  return shops
})
