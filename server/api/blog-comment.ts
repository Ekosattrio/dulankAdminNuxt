// GET /api/blog-comment — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('blog-comment')
})
