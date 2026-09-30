// GET /api/kertas-group-self — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('kertas-group-self')
})
