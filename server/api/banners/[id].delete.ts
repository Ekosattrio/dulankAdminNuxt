import { deleteBanner } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteBanner(id || '')

  return createResponse(result, 'Banner deleted successfully')
})
