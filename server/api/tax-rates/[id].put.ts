import { createError, defineEventHandler, readBody } from 'h3'
import { updateTaxRate } from '#server/utils/taxRatesData'
import type { TaxRateInput } from '#server/types/tax-rates'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody<Partial<TaxRateInput>>(event)
  const updated = updateTaxRate(id, body)
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Tax rate not found' })
  }

  return {
    success: true,
    data: updated,
    message: 'Tax rate updated successfully'
  }
})

