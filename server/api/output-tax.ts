// GET /api/output-tax — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('output-tax')
})
