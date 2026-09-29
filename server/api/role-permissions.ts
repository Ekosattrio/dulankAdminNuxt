import { roles } from '../data/role-permissions'

// GET /api/role-permissions — data mock roles
export default defineEventHandler(() => {
  return roles
})
