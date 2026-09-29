import { vendors } from '../data/semua-percetakan'

// GET /api/semua-percetakan — data mock vendors
export default defineEventHandler(() => {
  return vendors
})
