import { getSupplierDueReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filtered = await getSupplierDueReports(query)

  return createResponse(filtered, 'Supplier due reports fetched successfully')
})
