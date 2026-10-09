import { defineEventHandler, readBody } from 'h3'
import { saveIncomeRecord } from '#server/utils/financeTransactionData'
import type { IncomeFormData } from '#server/types/income'

export default defineEventHandler(async (event) => {
  const body = await readBody<IncomeFormData>(event)
  return { success: true, data: saveIncomeRecord(body), message: body.id ? 'Income berhasil diperbarui.' : 'Income berhasil ditambahkan.' }
})
