import { deleteInvoiceDomain } from '~~/server/utils/salesData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const result = await deleteInvoiceDomain(id)
  return createResponse(result, 'Invoice deleted successfully')
})
