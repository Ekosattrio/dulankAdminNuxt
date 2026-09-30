// GET /api/province — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('province')
})
