// GET /api/coupon — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('coupon')
})
