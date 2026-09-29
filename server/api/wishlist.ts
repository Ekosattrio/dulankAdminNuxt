import { wishlist } from '../data/wishlist'

// GET /api/wishlist — data mock wishlist
export default defineEventHandler(() => {
  return wishlist
})
