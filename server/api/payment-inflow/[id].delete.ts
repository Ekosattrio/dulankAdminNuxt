import { deletePaymentInflowDomain } from '~~/server/utils/paymentFlowData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const result = await deletePaymentInflowDomain(id)
  return createResponse(result, 'Payment inflow deleted successfully')
})
