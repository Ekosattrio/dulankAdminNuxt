// GET /api/wishlist — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('wishlist')
})
