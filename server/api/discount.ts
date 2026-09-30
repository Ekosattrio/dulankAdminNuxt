// GET /api/discount — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('discount')
})
