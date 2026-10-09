import { defineEventHandler, readBody } from 'h3'
import { saveMoneyTransfer } from '#server/utils/moneyTransferData'
import type { MoneyTransferFormData } from '#server/types/money-transfer'

export default defineEventHandler(async (event) => {
  const body = await readBody<MoneyTransferFormData>(event)
  const data = saveMoneyTransfer(body)
  return { success: true, data, message: body.id ? 'Money Transfer berhasil diperbarui.' : 'Money Transfer berhasil ditambahkan.' }
})

