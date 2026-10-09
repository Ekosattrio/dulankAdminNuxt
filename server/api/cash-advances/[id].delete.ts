import { createError, defineEventHandler, getRouterParam } from 'h3'
import { deleteCashAdvance } from '#server/utils/cashAdvanceData'
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID Cash Advance wajib disertakan.' })
  deleteCashAdvance(id)
  return { success: true, message: 'Cash Advance berhasil dihapus.' }
})
