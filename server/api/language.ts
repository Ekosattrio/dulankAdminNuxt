// GET /api/language — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('language')
})
