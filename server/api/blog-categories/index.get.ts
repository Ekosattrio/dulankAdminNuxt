import { getBlogCategories } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categories = await getBlogCategories({
    search: query.search as string,
    status: query.status as string,
  })

  return createResponse(categories, 'Blog categories fetched successfully')
})
