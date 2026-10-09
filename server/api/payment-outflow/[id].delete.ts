import { deletePaymentOutflowDomain } from '~~/server/utils/paymentFlowData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const result = await deletePaymentOutflowDomain(id)
  return createResponse(result, 'Payment outflow deleted successfully')
})
