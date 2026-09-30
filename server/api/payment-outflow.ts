// GET /api/payment-outflow — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('payment-outflow')
})
