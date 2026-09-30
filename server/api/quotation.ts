// GET /api/quotation — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('quotation')
})
