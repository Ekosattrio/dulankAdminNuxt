import { flowCategories, jobs } from '../data/job-list'

// GET /api/job-list — data mock: flowCategories, jobs
export default defineEventHandler(() => {
  return { flowCategories, jobs }
})
