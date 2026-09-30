import { customerAddresses, supplierAddresses } from '../data/address'

// GET /api/address — mock read-only (multi-array, tanpa CRUD)
export default defineEventHandler((event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Resource read-only' })
  }
  return { customerAddresses, supplierAddresses }
})
