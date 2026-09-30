// GET /api/flow-template — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('flow-template')
})
