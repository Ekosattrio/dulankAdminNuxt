import { deleteQuotationDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const result = await deleteQuotationDomain(id)
  return createResponse(result, 'Quotation deleted successfully')
})
