export default defineEventHandler((event) => {
  const query = getQuery(event)
  return createResponse(listDeliveryNotes({ search: String(query.search || ''), status: String(query.status || '') }))
})
