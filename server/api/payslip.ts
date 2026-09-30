// GET /api/payslip — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('payslip')
})
