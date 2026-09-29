import { cashAdvances } from '../data/cash-advance'

// GET /api/cash-advance — data mock cashAdvances
export default defineEventHandler(() => {
  return cashAdvances
})
