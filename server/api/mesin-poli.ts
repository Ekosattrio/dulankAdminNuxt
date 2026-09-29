import { polis } from '../data/mesin-poli'

// GET /api/mesin-poli — data mock polis
export default defineEventHandler(() => {
  return polis
})
