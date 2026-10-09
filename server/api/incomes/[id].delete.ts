import { createError, defineEventHandler, getRouterParam } from 'h3'
import { deleteIncomeRecord } from '#server/utils/financeTransactionData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID Income wajib disertakan.' })
  deleteIncomeRecord(id)
  return { success: true, message: 'Income berhasil dihapus.' }
})
