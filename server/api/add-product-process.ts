import { processes } from '../data/add-product-process'

// GET /api/add-product-process — data mock processes
export default defineEventHandler(() => {
  return processes
})
