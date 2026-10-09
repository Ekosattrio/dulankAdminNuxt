import { readData } from '~/server/utils/data'
import type { ExpenseCategory } from '~/types/expense-category'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<ExpenseCategory>('expense-categories.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (c) => c.categoryName.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)
    )
  }

  if (query.status) {
    filtered = filtered.filter((c) => c.status.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})

