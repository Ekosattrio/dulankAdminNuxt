// GET /api/support-ticket — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('support-ticket')
})
