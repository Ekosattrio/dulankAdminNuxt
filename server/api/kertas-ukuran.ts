import { sizes } from '../data/kertas-ukuran'

// GET /api/kertas-ukuran — data mock sizes
export default defineEventHandler(() => {
  return sizes
})
