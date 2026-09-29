import { employees } from '../data/employees'

// GET /api/employees — data mock employees
export default defineEventHandler(() => {
  return employees
})
