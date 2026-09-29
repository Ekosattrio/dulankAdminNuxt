import { invoices } from '../data/output-tax'

// GET /api/output-tax — data mock invoices
export default defineEventHandler(() => {
  return invoices
})
