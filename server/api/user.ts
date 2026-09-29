import { users } from '../data/user'

// GET /api/user — data mock users
export default defineEventHandler(() => {
  return users
})
