import { accounts } from '../data/bank-settings-list'

// GET /api/bank-settings-list — data mock accounts
export default defineEventHandler(() => {
  return accounts
})
