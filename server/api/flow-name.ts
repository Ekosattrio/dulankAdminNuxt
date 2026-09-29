import { flowNames } from '../data/flow-name'

// GET /api/flow-name — data mock flowNames
export default defineEventHandler(() => {
  return flowNames
})
