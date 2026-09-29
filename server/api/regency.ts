import { regencies } from '../data/regency'

// GET /api/regency — data mock regencies
export default defineEventHandler(() => {
  return regencies
})
