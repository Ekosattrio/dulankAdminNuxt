// GET /api/kertas-group — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('kertas-group')
})
