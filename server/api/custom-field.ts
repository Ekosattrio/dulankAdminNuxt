// GET /api/custom-field — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('custom-field')
})
