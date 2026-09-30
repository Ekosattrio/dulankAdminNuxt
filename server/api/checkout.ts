// GET /api/checkout — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('checkout')
})
