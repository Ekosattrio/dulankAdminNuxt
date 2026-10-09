import { deleteBlog } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteBlog(id || '')

  return createResponse(result, 'Blog deleted successfully')
})
