// GET /api/download-files — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('download-files')
})
