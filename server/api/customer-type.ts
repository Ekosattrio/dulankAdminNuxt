import { customerTypes } from '../data/customer-type'

// GET /api/customer-type — data mock customerTypes
export default defineEventHandler(() => {
  return customerTypes
})
