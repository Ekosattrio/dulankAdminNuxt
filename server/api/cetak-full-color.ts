// GET /api/cetak-full-color — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('cetak-full-color')
})
