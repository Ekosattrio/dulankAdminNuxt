import { units } from '../data/unit'

// GET /api/unit — data mock units
export default defineEventHandler(() => {
  return units
})
