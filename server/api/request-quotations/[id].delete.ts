import { deleteRequestQuotationDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const result = await deleteRequestQuotationDomain(id)
  return createResponse(result)
})
