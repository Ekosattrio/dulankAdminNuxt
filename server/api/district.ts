// GET /api/district — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('district')
})
