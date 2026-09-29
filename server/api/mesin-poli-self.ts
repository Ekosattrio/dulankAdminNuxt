import { polis } from '../data/mesin-poli-self'

// GET /api/mesin-poli-self — data mock polis
export default defineEventHandler(() => {
  return polis
})
