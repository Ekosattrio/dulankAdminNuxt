// GET /api/kertas-harga-self — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('kertas-harga-self')
})
