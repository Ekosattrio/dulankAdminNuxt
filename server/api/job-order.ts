import { jobOrders } from '../data/job-order'

// GET /api/job-order — data mock jobOrders
export default defineEventHandler(() => {
  return jobOrders
})
