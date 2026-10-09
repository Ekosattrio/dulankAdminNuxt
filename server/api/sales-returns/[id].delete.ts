import { deleteSalesReturnDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const result = await deleteSalesReturnDomain(id)
  return createResponse(result)
})
