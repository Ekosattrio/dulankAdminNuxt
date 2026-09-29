import { rfqs } from '../data/request-quotation'

// GET /api/request-quotation — data mock rfqs
export default defineEventHandler(() => {
  return rfqs
})
