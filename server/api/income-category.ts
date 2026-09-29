import { categories } from '../data/income-category'

// GET /api/income-category — data mock categories
export default defineEventHandler(() => {
  return categories
})
