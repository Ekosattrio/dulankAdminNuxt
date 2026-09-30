// GET /api/contact-form — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('contact-form')
})
