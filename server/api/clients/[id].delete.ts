import { deleteClient } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteClient(id || '')

  return createResponse(result, 'Client deleted successfully')
})
