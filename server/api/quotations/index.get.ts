export default defineEventHandler((event) => {
  const query = getQuery(event)
  return createResponse(listQuotations({ search: String(query.search || ''), status: String(query.status || '') }))
})
