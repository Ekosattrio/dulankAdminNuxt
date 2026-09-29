import { items } from '../data/my-incentive'

// GET /api/my-incentive — data mock items
export default defineEventHandler(() => {
  return items
})
