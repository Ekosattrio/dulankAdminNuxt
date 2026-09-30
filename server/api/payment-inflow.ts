// GET /api/payment-inflow — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('payment-inflow')
})
