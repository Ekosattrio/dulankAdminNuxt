// GET /api/bank-settings-grid — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('bank-settings-grid')
})
