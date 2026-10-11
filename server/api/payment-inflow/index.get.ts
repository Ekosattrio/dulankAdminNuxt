import type { PaymentFlowFilterParams } from '#server/types/payment-flow'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const filters = query as PaymentFlowFilterParams
  return createResponse(listPaymentFlows('inflow', filters), { balances: getPaymentBalances() })
})
