import { incomes } from '../data/income'

// GET /api/income — data mock incomes
export default defineEventHandler(() => {
  return incomes
})
