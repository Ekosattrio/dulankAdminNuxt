import { banList } from '../data/ban-ip-address'

// GET /api/ban-ip-address — data mock banList
export default defineEventHandler(() => {
  return banList
})
