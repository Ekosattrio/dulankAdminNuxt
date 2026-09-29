import { blogs } from '../data/all-blog'

// GET /api/all-blog — data mock blogs
export default defineEventHandler(() => {
  return blogs
})
