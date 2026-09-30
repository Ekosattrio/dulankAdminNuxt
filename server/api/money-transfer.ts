// GET /api/money-transfer — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('money-transfer')
})
