export default defineEventHandler(async (event) => {
  const body = await readBody<{ code: string; subtotal: number; customer: string; saleId?: string }>(event)
  if (!body?.code?.trim() || !Number.isFinite(body.subtotal) || body.subtotal < 0)
    throw createError({ statusCode: 400, statusMessage: 'Enter a voucher and valid subtotal' })
  return createResponse({
    discount: salesVoucherDiscount(body.code, body.subtotal, body.customer, body.saleId),
  })
})
