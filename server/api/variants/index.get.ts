import { getVariants } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const variants = await getVariants({
    search: query.search as string,
    status: query.status as string,
  })

  return createResponse(variants, 'Variants fetched successfully')
})
