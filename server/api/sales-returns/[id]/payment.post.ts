import type { ReturnPayment } from '#server/types/sales-return'

export default defineEventHandler(async (event) =>
  createResponse(
    await recordSalesReturnPayment(Number(getRouterParam(event, 'id')), await readBody<ReturnPayment>(event)),
    'Refund payment recorded successfully',
  ),
)
