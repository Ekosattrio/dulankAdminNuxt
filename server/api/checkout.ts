import { checkouts } from '../data/checkout'

// GET /api/checkout — data mock checkouts
export default defineEventHandler(() => {
  return checkouts
})
