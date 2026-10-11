export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return createResponse(deletePaymentFlow('inflow', id || ''), 'Payment inflow deleted successfully')
})
