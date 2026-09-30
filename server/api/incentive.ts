// GET /api/incentive — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('incentive')
})
