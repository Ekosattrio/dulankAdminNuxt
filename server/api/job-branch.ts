import { jobs } from '../data/job-branch'

// GET /api/job-branch — data mock jobs
export default defineEventHandler(() => {
  return jobs
})
