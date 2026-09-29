import { transfers } from '../data/money-transfer'

// GET /api/money-transfer — data mock transfers
export default defineEventHandler(() => {
  return transfers
})
