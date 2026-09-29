import { currencies } from '../data/currency-settings'

// GET /api/currency-settings — data mock currencies
export default defineEventHandler(() => {
  return currencies
})
