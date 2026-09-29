import { salesList } from '../data/sales'

// GET /api/sales — data mock salesList
export default defineEventHandler(() => {
  return salesList
})
