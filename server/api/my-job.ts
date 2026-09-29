import { jobs } from '../data/my-job'

// GET /api/my-job — data mock jobs
export default defineEventHandler(() => {
  return jobs
})
