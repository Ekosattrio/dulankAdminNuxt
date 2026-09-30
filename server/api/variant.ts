// GET /api/variant — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('variant')
})
