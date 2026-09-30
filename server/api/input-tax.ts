// GET /api/input-tax — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('input-tax')
})
