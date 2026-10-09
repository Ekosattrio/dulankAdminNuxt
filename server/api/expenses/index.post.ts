import { defineEventHandler, readBody } from 'h3'
import { saveExpenseRecord } from '#server/utils/financeTransactionData'
import type { ExpenseFormData } from '#server/types/expense'

export default defineEventHandler(async (event) => {
  const body = await readBody<ExpenseFormData>(event)
  return { success: true, data: saveExpenseRecord(body), message: body.id ? 'Expense berhasil diperbarui.' : 'Expense berhasil ditambahkan.' }
})
