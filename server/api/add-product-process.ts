// GET /api/add-product-process — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('add-product-process')
})
