import { incentives } from '../data/incentive'

// GET /api/incentive — data mock incentives
export default defineEventHandler(() => {
  return incentives
})
