// GET /api/invoice — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('invoice')
})
