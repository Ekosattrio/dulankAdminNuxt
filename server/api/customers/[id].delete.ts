import { archiveCustomer } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await archiveCustomer(id || '')

  return createResponse(result)
})
