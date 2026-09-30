// GET /api/mesin-pond-self — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('mesin-pond-self')
})
