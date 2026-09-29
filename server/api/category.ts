import { categories } from '../data/category'

// GET /api/category — data mock categories
export default defineEventHandler(() => {
  return categories
})
