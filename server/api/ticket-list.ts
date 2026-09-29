import { tickets } from '../data/ticket-list'

// GET /api/ticket-list — data mock tickets
export default defineEventHandler(() => {
  return tickets
})
