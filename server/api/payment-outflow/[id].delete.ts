export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return createResponse(deletePaymentFlow('outflow', id || ''), 'Payment outflow deleted successfully')
})
