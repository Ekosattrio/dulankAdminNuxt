import { readData, writeData } from '~/server/utils/data'
import type { PayslipItem } from '~/types/payslip'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PayslipItem>>(event)
  const items = readData<PayslipItem>('payslips.json')

  const dayWorked = Number(body.dayWorked || 0)
  const salaryRate = Number(body.salaryRate || 0)
  const allowance = Number(body.allowance || 0)
  const overtime = Number(body.overtime || 0)
  const deduction = Number(body.deduction || 0)

  // Daily base vs monthly rate heuristic
  const baseSalary = salaryRate < 1000000 ? salaryRate * dayWorked : Math.round((salaryRate / 24) * dayWorked)
  const total = baseSalary + allowance + overtime - deduction

  if (body.id) {
    const index = items.findIndex((p) => String(p.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body,
        salaryRate,
        dayWorked,
        allowance,
        overtime,
        deduction,
        total: Number(body.total ?? total)
      } as PayslipItem
      writeData('payslips.json', items)
      return { success: true, data: items[index], message: 'Payslip updated successfully' }
    }
  }

  const nextNum = items.length + 1
  const newSlip: PayslipItem = {
    id: Date.now().toString(),
    slipNo: body.slipNo || `PS${String(nextNum).padStart(6, '0')}`,
    name: body.name || '',
    period: body.period || '01/03/26 - 31/03/26',
    salaryRate,
    dayWorked,
    allowance,
    overtime,
    deduction,
    total,
    status: body.status || 'Unpaid',
    paidDate: body.status === 'Paid' ? (body.paidDate || new Date().toLocaleDateString('id-ID')) : '-'
  }

  items.unshift(newSlip)
  writeData('payslips.json', items)

  return {
    success: true,
    data: newSlip,
    message: 'Payslip created successfully'
  }
})

