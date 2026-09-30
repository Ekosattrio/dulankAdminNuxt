// GET /api/role — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('role')
})
