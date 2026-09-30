// GET /api/edit-job-order — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('edit-job-order')
})
