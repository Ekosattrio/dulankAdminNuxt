import { ponds } from '../data/mesin-pond-self'

// GET /api/mesin-pond-self — data mock ponds
export default defineEventHandler(() => {
  return ponds
})
