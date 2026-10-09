import { readData } from '~/server/utils/data'
import type { PayslipItem } from '~/types/payslip'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<PayslipItem>('payslips.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.slipNo.toLowerCase().includes(s) ||
        p.period.toLowerCase().includes(s)
    )
  }

  if (query.status) {
    filtered = filtered.filter((p) => p.status.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})

