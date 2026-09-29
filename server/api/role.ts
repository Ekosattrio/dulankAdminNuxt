import { groups } from '../data/role'

// GET /api/role — data mock groups
export default defineEventHandler(() => {
  return groups
})
