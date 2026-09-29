import { items } from '../data/kertas-jenis-self'

// GET /api/kertas-jenis-self — data mock items
export default defineEventHandler(() => {
  return items
})
