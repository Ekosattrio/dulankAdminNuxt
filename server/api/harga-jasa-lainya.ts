import { items } from '../data/harga-jasa-lainya'

// GET /api/harga-jasa-lainya — data mock items
export default defineEventHandler(() => {
  return items
})
