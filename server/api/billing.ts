import { billings } from '../data/billing'

// GET /api/billing — data mock billings
export default defineEventHandler(() => {
  return billings
})
