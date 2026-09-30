// GET /api/expenses — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('expenses')
})
