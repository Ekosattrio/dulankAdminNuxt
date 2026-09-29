import { reviews } from '../data/reviews'

// GET /api/reviews — data mock reviews
export default defineEventHandler(() => {
  return reviews
})
