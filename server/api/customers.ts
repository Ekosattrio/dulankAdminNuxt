// GET /api/customers — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('customers')
})
