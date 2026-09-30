// GET /api/user-admin — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('user-admin')
})
