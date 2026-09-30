// GET /api/bank-settings-list — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('bank-settings-list')
})
