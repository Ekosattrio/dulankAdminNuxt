// GET /api/komponen-minimum — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('komponen-minimum')
})
