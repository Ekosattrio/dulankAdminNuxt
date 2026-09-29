import { preferences } from '../data/preference'

// GET /api/preference — data mock preferences
export default defineEventHandler(() => {
  return preferences
})
