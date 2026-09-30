// GET /api/permissions — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('permissions')
})
