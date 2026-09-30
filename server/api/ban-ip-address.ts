// GET /api/ban-ip-address — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('ban-ip-address')
})
