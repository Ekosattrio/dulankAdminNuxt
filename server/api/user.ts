// GET /api/user — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('user')
})
