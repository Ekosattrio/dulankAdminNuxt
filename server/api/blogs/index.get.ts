import { getBlogs } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const blogs = await getBlogs({
    search: query.search as string,
    status: query.status as string,
    category: query.category as string,
  })

  return createResponse(blogs, 'Blogs fetched successfully')
})
