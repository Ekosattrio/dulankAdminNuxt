import { groups } from '../data/kertas-group'

// GET /api/kertas-group — data mock groups
export default defineEventHandler(() => {
  return groups
})
