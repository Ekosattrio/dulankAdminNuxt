import { designations } from '../data/designation'

// GET /api/designation — data mock designations
export default defineEventHandler(() => {
  return designations
})
