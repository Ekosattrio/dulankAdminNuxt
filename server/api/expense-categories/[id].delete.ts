import { readData, writeData } from '~/server/utils/data'
import type { ExpenseCategory } from '~/types/expense-category'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<ExpenseCategory>('expense-categories.json')

  const updated = items.filter((c) => String(c.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Expense category not found'
    })
  }

  writeData('expense-categories.json', updated)

  return {
    success: true,
    data: { id }
  }
})

