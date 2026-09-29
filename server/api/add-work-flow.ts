import { flowSteps } from '../data/add-work-flow'

// GET /api/add-work-flow — data mock flowSteps
export default defineEventHandler(() => {
  return flowSteps
})
