import { progressList } from '../data/job-progress'

// GET /api/job-progress — data mock progressList
export default defineEventHandler(() => {
  return progressList
})
