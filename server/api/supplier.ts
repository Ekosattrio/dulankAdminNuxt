// GET /api/supplier — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('supplier')
})
