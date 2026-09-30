// GET /api/kertas-ukuran-self — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('kertas-ukuran-self')
})
