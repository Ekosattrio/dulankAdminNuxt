import { getInvoiceReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filtered = await getInvoiceReports(query)

  return createResponse(filtered, 'Invoice reports fetched successfully')
})
