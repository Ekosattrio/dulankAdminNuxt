import { stores } from '../data/store-list'

// GET /api/store-list — data mock stores
export default defineEventHandler(() => {
  return stores
})
