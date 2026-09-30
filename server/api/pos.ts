import { products, cart } from '../data/pos'

// GET /api/pos — mock read-only (multi-array, tanpa CRUD)
export default defineEventHandler((event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Resource read-only' })
  }
  return { products, cart }
})
