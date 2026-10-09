import { deleteBlogTag } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteBlogTag(id || '')

  return createResponse(result, 'Blog tag deleted successfully')
})
