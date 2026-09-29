import { subscriptions } from '../data/subscriptions'

// GET /api/subscriptions — data mock subscriptions
export default defineEventHandler(() => {
  return subscriptions
})
