// GET /api/mesin-pond — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('mesin-pond')
})
