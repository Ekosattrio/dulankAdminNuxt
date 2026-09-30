// GET /api/our-client — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('our-client')
})
