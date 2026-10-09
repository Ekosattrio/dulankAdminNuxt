import { defineEventHandler } from 'h3'
import { getTaxRates } from '#server/utils/taxRatesData'

export default defineEventHandler(async () => {
  const data = getTaxRates()
  return {
    success: true,
    data
  }
})

