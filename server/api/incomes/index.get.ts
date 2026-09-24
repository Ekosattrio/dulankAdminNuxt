import { readData } from '~/server/utils/data'
import type { IncomeRecord } from '~/types/income'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<IncomeRecord>('incomes.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(s) ||
        item.no.toLowerCase().includes(s) ||
        item.notes.toLowerCase().includes(s) ||
        item.category.toLowerCase().includes(s)
    )
  }

  if (query.category) {
    filtered = filtered.filter((item) => item.category.toLowerCase() === String(query.category).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})

