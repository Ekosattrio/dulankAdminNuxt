import { comments } from '../data/blog-comment'

// GET /api/blog-comment — data mock comments
export default defineEventHandler(() => {
  return comments
})
