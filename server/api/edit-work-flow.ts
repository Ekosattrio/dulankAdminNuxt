import { flowSteps } from '../data/edit-work-flow'

// GET /api/edit-work-flow — data mock flowSteps
export default defineEventHandler(() => {
  return flowSteps
})
