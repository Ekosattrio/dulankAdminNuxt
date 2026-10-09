import { deleteSaleDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const result = await deleteSaleDomain(id)
  return createResponse(result, 'Sale deleted successfully')
})
