import { createError, defineEventHandler, getRouterParam } from 'h3'
import { deleteExpenseRecord } from '#server/utils/financeTransactionData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID Expense wajib disertakan.' })
  deleteExpenseRecord(id)
  return { success: true, message: 'Expense berhasil dihapus.' }
})
