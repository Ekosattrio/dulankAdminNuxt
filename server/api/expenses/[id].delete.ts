import { readData, writeData } from '~/server/utils/data'
import type { Expense } from '~/types/expense'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<Expense>('expenses.json')

  const updated = items.filter((e) => String(e.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Expense not found'
    })
  }

  writeData('expenses.json', updated)

  return {
    success: true,
    data: { id }
  }
})

