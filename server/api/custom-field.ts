import { customFields } from '../data/custom-field'

// GET /api/custom-field — data mock customFields
export default defineEventHandler(() => {
  return customFields
})
