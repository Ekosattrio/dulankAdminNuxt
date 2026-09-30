// GET /api/income-category — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('income-category')
})
