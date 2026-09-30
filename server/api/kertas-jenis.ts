// GET /api/kertas-jenis — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('kertas-jenis')
})
