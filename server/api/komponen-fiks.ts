import { components } from '../data/komponen-fiks'

// GET /api/komponen-fiks — data mock components
export default defineEventHandler(() => {
  return components
})
