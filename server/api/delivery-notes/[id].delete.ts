import { deleteDeliveryNoteDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const result = await deleteDeliveryNoteDomain(id)
  return createResponse(result, 'Delivery note deleted successfully')
})
