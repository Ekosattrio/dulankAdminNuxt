// GET /api/online-orders — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('online-orders')
})
