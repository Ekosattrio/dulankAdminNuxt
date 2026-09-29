import { ponds } from '../data/mesin-pond'

// GET /api/mesin-pond — data mock ponds
export default defineEventHandler(() => {
  return ponds
})
