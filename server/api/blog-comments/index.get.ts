import { getBlogComments } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const comments = await getBlogComments({
    search: query.search as string,
    status: query.status as string,
  })

  return createResponse(comments, 'Blog comments fetched successfully')
})
