// GET /api/cash-advance — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('cash-advance')
})
