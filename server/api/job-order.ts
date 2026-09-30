// GET /api/job-order — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('job-order')
})
