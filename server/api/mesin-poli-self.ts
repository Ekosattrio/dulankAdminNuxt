// GET /api/mesin-poli-self — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('mesin-poli-self')
})
