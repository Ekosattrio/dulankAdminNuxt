// GET /api/work-flow — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('work-flow')
})
