// GET /api/mesin-cetak — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('mesin-cetak')
})
