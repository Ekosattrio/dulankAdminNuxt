import { readData } from '~/server/utils/data'
import type { Expense } from '~/types/expense'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<Expense>('expenses.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.noExpense.toLowerCase().includes(s) ||
        e.name.toLowerCase().includes(s) ||
        e.category.toLowerCase().includes(s) ||
        e.description.toLowerCase().includes(s)
    )
  }

  if (query.status) {
    filtered = filtered.filter((e) => e.status.toLowerCase() === String(query.status).toLowerCase())
  }

  if (query.category) {
    filtered = filtered.filter((e) => e.category.toLowerCase() === String(query.category).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})

