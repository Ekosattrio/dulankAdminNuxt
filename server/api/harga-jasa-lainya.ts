// GET /api/harga-jasa-lainya — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('harga-jasa-lainya')
})
