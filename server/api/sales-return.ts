import { returns } from '../data/sales-return'

// GET /api/sales-return — data mock returns
export default defineEventHandler(() => {
  return returns
})
