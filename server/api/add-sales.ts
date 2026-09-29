import { items } from '../data/add-sales'

// GET /api/add-sales — data mock items
export default defineEventHandler(() => {
  return items
})
