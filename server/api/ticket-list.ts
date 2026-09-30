// GET /api/ticket-list — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('ticket-list')
})
