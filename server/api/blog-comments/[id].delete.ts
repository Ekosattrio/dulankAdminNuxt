import { deleteBlogComment } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteBlogComment(id || '')

  return createResponse(result, 'Comment deleted successfully')
})
