import { taxRates } from '../data/tax-rates'

// GET /api/tax-rates — data mock taxRates
export default defineEventHandler(() => {
  return taxRates
})
