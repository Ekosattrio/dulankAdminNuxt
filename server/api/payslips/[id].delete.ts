import { readData, writeData } from '~/server/utils/data'
import type { PayslipItem } from '~/types/payslip'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<PayslipItem>('payslips.json')

  const updated = items.filter((p) => String(p.id) !== String(id) && String(p.slipNo) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Payslip not found'
    })
  }

  writeData('payslips.json', updated)

  return {
    success: true,
    data: { id }
  }
})

