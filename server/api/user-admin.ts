import { admins } from '../data/user-admin'

// GET /api/user-admin — data mock admins
export default defineEventHandler(() => {
  return admins
})
