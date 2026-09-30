// GET /api/flow-name — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('flow-name')
})
