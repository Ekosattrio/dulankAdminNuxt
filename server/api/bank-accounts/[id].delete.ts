import { createError, defineEventHandler, getRouterParam } from 'h3'
import { deleteBankAccount } from '#server/utils/bankAccountData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID Bank Account wajib disertakan.' })
  deleteBankAccount(id)
  return { success: true, message: 'Bank Account berhasil dihapus.' }
})

