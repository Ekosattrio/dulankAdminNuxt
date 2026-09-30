// GET /api/unit — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('unit')
})
