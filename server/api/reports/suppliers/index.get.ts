import { getSupplierReports } from '~~/server/utils/reportsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filtered = await getSupplierReports(query)

  return createResponse(filtered, 'Supplier reports fetched successfully')
})
