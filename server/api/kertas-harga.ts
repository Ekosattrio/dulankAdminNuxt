// GET /api/kertas-harga — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('kertas-harga')
})
