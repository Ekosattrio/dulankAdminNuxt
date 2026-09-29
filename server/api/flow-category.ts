import { categories } from '../data/flow-category'

// GET /api/flow-category — data mock categories
export default defineEventHandler(() => {
  return categories
})
