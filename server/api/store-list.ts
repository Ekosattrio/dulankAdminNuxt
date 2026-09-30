// GET /api/store-list — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('store-list')
})
