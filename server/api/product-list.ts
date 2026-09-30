// GET /api/product-list — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('product-list')
})
