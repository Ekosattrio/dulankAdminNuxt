// GET /api/kalkulator-dashboard — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('kalkulator-dashboard')
})
