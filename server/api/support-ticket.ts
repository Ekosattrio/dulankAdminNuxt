import { tickets } from '../data/support-ticket'

// GET /api/support-ticket — data mock tickets
export default defineEventHandler(() => {
  return tickets
})
