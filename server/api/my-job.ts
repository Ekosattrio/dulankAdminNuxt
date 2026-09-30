// GET /api/my-job — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('my-job')
})
