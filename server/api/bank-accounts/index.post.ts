import { defineEventHandler, readBody } from 'h3'
import { saveBankAccount } from '#server/utils/bankAccountData'
import type { BankAccountFormData } from '#server/types/bank-account'

export default defineEventHandler(async (event) => {
  const body = await readBody<BankAccountFormData>(event)
  const data = saveBankAccount(body)
  return {
    success: true,
    data,
    message: body.id ? 'Bank Account berhasil diperbarui.' : 'Bank Account berhasil ditambahkan.',
  }
})

