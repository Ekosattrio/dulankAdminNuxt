import { workflows } from '../data/work-flow'

// GET /api/work-flow — data mock workflows
export default defineEventHandler(() => {
  return workflows
})
