// GET /api/mesin-laminasi — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('mesin-laminasi')
})
