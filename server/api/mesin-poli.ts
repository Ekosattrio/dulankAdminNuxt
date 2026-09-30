// GET /api/mesin-poli — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('mesin-poli')
})
