import { readData, writeData } from '~/server/utils/data'
import type { Expense } from '~/types/expense'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Expense>>(event)
  const items = readData<Expense>('expenses.json')

  const amount = Number(body.amount || 0)
  const paid = Number(body.paid || 0)
  const due = Math.max(0, amount - paid)

  if (body.id) {
    const index = items.findIndex((e) => String(e.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body,
        amount,
        paid,
        due
      } as Expense
      writeData('expenses.json', items)
      return { success: true, data: items[index], message: 'Expense updated successfully' }
    }
  }

  const nextNum = items.length + 1
  const newExpense: Expense = {
    id: Date.now().toString(),
    noExpense: body.noExpense || `EX${String(nextNum).padStart(6, '0')}`,
    date: body.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    category: body.category || 'General',
    name: body.name || '',
    status: body.status || (due === 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid'),
    amount,
    paid,
    due,
    description: body.description || ''
  }

  items.unshift(newExpense)
  writeData('expenses.json', items)

  return {
    success: true,
    data: newExpense,
    message: 'Expense created successfully'
  }
})

