// GET /api/add-work-flow — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('add-work-flow')
})
