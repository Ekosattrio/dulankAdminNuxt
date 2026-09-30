// GET /api/printer-settings — data mock (dari mock store in-memory)
export default defineEventHandler(() => {
  return useMockCollection('printer-settings')
})
