// GET /api/sales — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('sales')
})
