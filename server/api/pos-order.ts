// GET /api/pos-order — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('pos-order')
})
