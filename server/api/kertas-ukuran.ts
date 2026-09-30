// GET /api/kertas-ukuran — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('kertas-ukuran')
})
