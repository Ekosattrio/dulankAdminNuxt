import { groups } from '../data/kertas-group-self'

// GET /api/kertas-group-self — data mock groups
export default defineEventHandler(() => {
  return groups
})
