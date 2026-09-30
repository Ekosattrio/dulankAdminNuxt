// GET /api/job-branch — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('job-branch')
})
