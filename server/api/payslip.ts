import { payslips } from '../data/payslip'

// GET /api/payslip — data mock payslips
export default defineEventHandler(() => {
  return payslips
})
