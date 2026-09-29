import { clients } from '../data/our-client'

// GET /api/our-client — data mock clients
export default defineEventHandler(() => {
  return clients
})
