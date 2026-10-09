import { deleteBlogCategory } from '~~/server/utils/blogDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteBlogCategory(id || '')

  return createResponse(result, 'Blog category deleted successfully')
})
