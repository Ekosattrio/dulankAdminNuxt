import { invoices } from '../data/input-tax'

// GET /api/input-tax — data mock invoices
export default defineEventHandler(() => {
  return invoices
})
