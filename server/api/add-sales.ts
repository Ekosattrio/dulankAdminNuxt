// GET /api/add-sales — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('add-sales')
})
