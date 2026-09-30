// GET /api/role-permissions — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('role-permissions')
})
