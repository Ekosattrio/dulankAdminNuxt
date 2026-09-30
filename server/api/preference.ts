// GET /api/preference — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('preference')
})
