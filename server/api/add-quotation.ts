import { items } from '../data/add-quotation'

// GET /api/add-quotation — data mock items
export default defineEventHandler(() => {
  return items
})
