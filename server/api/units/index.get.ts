import { getUnits } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const units = await getUnits({
    search: query.search as string,
    status: query.status as string,
  })

  return createResponse(units, 'Units fetched successfully')
})
