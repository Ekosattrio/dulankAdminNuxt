import { mainBanners, productBanners } from '../data/banner'

// GET /api/banner — mock read-only (multi-array, tanpa CRUD)
export default defineEventHandler((event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Resource read-only' })
  }
  return { mainBanners, productBanners }
})
