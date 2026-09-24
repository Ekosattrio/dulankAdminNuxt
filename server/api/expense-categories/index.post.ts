import { readData, writeData } from '~/server/utils/data'
import type { ExpenseCategory } from '~/types/expense-category'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<ExpenseCategory>>(event)
  const items = readData<ExpenseCategory>('expense-categories.json')

  const nowFormatted = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  if (body.id) {
    const index = items.findIndex((c) => String(c.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body
      } as ExpenseCategory
      writeData('expense-categories.json', items)
      return { success: true, data: items[index], message: 'Expense category updated successfully' }
    }
  }

  const newCategory: ExpenseCategory = {
    id: Date.now().toString(),
    categoryName: body.categoryName || '',
    description: body.description || '',
    date: body.date || nowFormatted,
    status: body.status || 'Active'
  }

  items.unshift(newCategory)
  writeData('expense-categories.json', items)

  return {
    success: true,
    data: newCategory,
    message: 'Expense category created successfully'
  }
})

