// GET /api/tax-rates — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('tax-rates')
})
