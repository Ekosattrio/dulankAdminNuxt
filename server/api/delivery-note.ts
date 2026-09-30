// GET /api/delivery-note — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('delivery-note')
})
