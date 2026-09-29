import { modules } from '../data/permissions'

// GET /api/permissions — data mock modules
export default defineEventHandler(() => {
  return modules
})
