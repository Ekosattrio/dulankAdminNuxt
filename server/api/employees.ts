// GET /api/employees — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('employees')
})
