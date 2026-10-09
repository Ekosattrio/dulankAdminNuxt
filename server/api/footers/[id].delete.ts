import { deleteFooterLink } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteFooterLink(id || '')

  return createResponse(result, 'Footer link deleted successfully')
})
