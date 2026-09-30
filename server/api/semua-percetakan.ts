// GET /api/semua-percetakan — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('semua-percetakan')
})
