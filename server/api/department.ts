import { departments } from '../data/department'

// GET /api/department — data mock departments
export default defineEventHandler(() => {
  return departments
})
