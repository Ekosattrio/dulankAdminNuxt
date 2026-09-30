// GET /api/best-seller — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('best-seller')
})
