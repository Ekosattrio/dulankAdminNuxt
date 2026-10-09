import { deleteSupplier } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deleteSupplier(id || '')

  return createResponse(result, 'Supplier deleted successfully')
})
