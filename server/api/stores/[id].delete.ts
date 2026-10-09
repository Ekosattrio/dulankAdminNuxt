import { deleteStore } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteStore(id || '')

  return createResponse(result, 'Store deleted successfully')
})
