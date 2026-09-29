import { tags } from '../data/blog-tag'

// GET /api/blog-tag — data mock tags
export default defineEventHandler(() => {
  return tags
})
