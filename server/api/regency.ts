// GET /api/regency — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('regency')
})
