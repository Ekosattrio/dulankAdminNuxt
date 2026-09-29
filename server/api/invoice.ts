import { invoices } from '../data/invoice'

// GET /api/invoice — data mock invoices
export default defineEventHandler(() => {
  return invoices
})
