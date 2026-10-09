import { getCategories } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categories = await getCategories({
    search: query.search as string,
    status: query.status as string,
  })

  return createResponse(categories, 'Categories fetched successfully')
})
