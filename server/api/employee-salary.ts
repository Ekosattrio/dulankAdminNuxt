// GET /api/employee-salary — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('employee-salary')
})
