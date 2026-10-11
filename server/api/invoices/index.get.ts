export default defineEventHandler((event) => {
  const query = getQuery(event)
  return createResponse(listInvoices({ search: String(query.search || ''), status: String(query.status || '') }))
})
