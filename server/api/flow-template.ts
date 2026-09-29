import { templates } from '../data/flow-template'

// GET /api/flow-template — data mock templates
export default defineEventHandler(() => {
  return templates
})
