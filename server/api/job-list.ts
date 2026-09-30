import { flowCategories, jobs } from '../data/job-list'

// GET /api/job-list — mock read-only (multi-array, tanpa CRUD)
export default defineEventHandler((event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Resource read-only' })
  }
  return { flowCategories, jobs }
})
