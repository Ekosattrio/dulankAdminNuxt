import { readData, writeData } from '~/server/utils/data'
import type { IncomeRecord } from '~/types/income'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<IncomeRecord>>(event)
  const items = readData<IncomeRecord>('incomes.json')

  const amount = Number(body.amount || 0)

  if (body.id) {
    const index = items.findIndex((item) => String(item.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body,
        amount
      } as IncomeRecord
      writeData('incomes.json', items)
      return { success: true, data: items[index], message: 'Income updated successfully' }
    }
  }

  const nextNum = items.length + 1
  const newIncome: IncomeRecord = {
    id: Date.now().toString(),
    no: body.no || `IN${String(nextNum).padStart(6, '0')}`,
    date: body.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    name: body.name || '',
    category: body.category || 'Penjualan Jasa Cetak',
    notes: body.notes || '',
    amount,
    paymentMethod: body.paymentMethod || 'Transfer Bank',
    bankAccount: body.bankAccount || 'BCA 8830129841',
    isCancelled: Boolean(body.isCancelled)
  }

  items.unshift(newIncome)
  writeData('incomes.json', items)

  return {
    success: true,
    data: newIncome,
    message: 'Income recorded successfully'
  }
})

