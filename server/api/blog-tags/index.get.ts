import { getBlogTags } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const tags = await getBlogTags({
    search: query.search as string,
  })

  return createResponse(tags, 'Blog tags fetched successfully')
})
