import { categories } from '../data/blog-category'

// GET /api/blog-category — data mock categories
export default defineEventHandler(() => {
  return categories
})
