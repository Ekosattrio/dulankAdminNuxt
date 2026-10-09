import { createError, defineEventHandler, getRouterParam } from 'h3'
import { deleteBankAccountType } from '#server/utils/bankAccountData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID Account Type wajib disertakan.' })
  deleteBankAccountType(id)
  return { success: true, message: 'Account Type berhasil dihapus.' }
})

