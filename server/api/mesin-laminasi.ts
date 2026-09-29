import { laminates } from '../data/mesin-laminasi'

// GET /api/mesin-laminasi — data mock laminates
export default defineEventHandler(() => {
  return laminates
})
