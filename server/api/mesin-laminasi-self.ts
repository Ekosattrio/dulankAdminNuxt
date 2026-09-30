// GET /api/mesin-laminasi-self — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('mesin-laminasi-self')
})
