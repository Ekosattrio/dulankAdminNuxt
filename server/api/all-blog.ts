// GET /api/all-blog — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('all-blog')
})
