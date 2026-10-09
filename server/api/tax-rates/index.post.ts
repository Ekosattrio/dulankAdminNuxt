import { createError, defineEventHandler, readBody } from 'h3'
import { createTaxRate } from '#server/utils/taxRatesData'
import type { TaxRateInput } from '#server/types/tax-rates'

export default defineEventHandler(async (event) => {
  const body = await readBody<TaxRateInput>(event)
  if (!body || !body.name || typeof body.rate !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'Name and numeric Rate are required' })
  }

  const created = createTaxRate(body)
  return {
    success: true,
    data: created,
    message: 'Tax rate created successfully'
  }
})

