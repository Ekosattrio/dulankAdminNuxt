import { laminates } from '../data/mesin-laminasi-self'

// GET /api/mesin-laminasi-self — data mock laminates
export default defineEventHandler(() => {
  return laminates
})
