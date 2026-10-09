import { getSubCategories } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const subCategories = await getSubCategories({
    search: query.search as string,
    category: query.category as string,
    status: query.status as string,
  })

  return createResponse(subCategories, 'Sub categories fetched successfully')
})
