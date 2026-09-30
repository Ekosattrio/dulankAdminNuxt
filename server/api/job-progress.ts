// GET /api/job-progress — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('job-progress')
})
