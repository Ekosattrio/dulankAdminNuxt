// GET /api/mesin-cetak-self — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('mesin-cetak-self')
})
