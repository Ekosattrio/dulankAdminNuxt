import { quotations } from '../data/quotation'

// GET /api/quotation — data mock quotations
export default defineEventHandler(() => {
  return quotations
})
