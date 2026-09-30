// GET /api/sales-return — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('sales-return')
})
