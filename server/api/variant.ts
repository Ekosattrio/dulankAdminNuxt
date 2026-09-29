import { variants } from '../data/variant'

// GET /api/variant — data mock variants
export default defineEventHandler(() => {
  return variants
})
