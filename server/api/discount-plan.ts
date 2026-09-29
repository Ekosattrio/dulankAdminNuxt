import { plans } from '../data/discount-plan'

// GET /api/discount-plan — data mock plans
export default defineEventHandler(() => {
  return plans
})
