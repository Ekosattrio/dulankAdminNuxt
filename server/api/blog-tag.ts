// GET /api/blog-tag — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('blog-tag')
})
