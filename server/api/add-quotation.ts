// GET /api/add-quotation — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('add-quotation')
})
