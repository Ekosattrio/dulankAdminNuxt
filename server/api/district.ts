import { districts } from '../data/district'

// GET /api/district — data mock districts
export default defineEventHandler(() => {
  return districts
})
