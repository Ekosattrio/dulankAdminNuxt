import type { Quotation } from '~/types/quotation'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Quotation ID is required',
    })
  }

  const allQuotations = await readSalesData<Quotation>('quotations.json')
  const newQuotations = allQuotations.filter((q) => q.id !== id && q.noQuotation !== id)

  if (allQuotations.length === newQuotations.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Quotation not found',
    })
  }

  await writeJSON('quotations.json', newQuotations)

  return createResponse({ id }, 'Quotation deleted successfully')
})
