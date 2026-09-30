// GET /api/semua-toko-kertas — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('semua-toko-kertas')
})
