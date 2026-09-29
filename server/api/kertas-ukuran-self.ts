import { sizes } from '../data/kertas-ukuran-self'

// GET /api/kertas-ukuran-self — data mock sizes
export default defineEventHandler(() => {
  return sizes
})
