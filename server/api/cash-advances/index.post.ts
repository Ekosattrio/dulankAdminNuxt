import { defineEventHandler, readBody } from 'h3'
import { saveCashAdvance } from '#server/utils/cashAdvanceData'
import type { CashAdvanceFormData } from '#server/types/cash-advance'
export default defineEventHandler(async (event) => {
  const body = await readBody<CashAdvanceFormData>(event)
  return { success: true, data: saveCashAdvance(body), message: body.id ? 'Cash Advance berhasil diperbarui.' : 'Cash Advance berhasil ditambahkan.' }
})
