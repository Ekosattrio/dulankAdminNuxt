import { accounts } from '../data/bank-settings-grid'

// GET /api/bank-settings-grid — data mock accounts
export default defineEventHandler(() => {
  return accounts
})
