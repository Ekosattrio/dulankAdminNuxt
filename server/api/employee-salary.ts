import { records } from '../data/employee-salary'

// GET /api/employee-salary — data mock records
export default defineEventHandler(() => {
  return records
})
