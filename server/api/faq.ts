// GET /api/faq — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('faq')
})
