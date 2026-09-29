import { orderProducts } from '../data/edit-job-order'

// GET /api/edit-job-order — data mock orderProducts
export default defineEventHandler(() => {
  return orderProducts
})
