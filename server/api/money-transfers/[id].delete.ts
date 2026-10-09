import { createError, defineEventHandler, getRouterParam } from 'h3'
import { deleteMoneyTransfer } from '#server/utils/moneyTransferData'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID Money Transfer wajib disertakan.' })
  deleteMoneyTransfer(id)
  return { success: true, message: 'Money Transfer berhasil dihapus.' }
})

