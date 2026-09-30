// GET /api/currency-settings — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('currency-settings')
})
