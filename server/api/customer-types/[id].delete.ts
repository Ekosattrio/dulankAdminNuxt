import { deleteCustomerType } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteCustomerType(id || '')

  return createResponse(result, 'Customer type deleted successfully')
})
