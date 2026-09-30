// GET /api/category — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('category')
})
