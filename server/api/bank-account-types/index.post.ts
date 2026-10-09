import { defineEventHandler, readBody } from 'h3'
import { saveBankAccountType } from '#server/utils/bankAccountData'
import type { BankAccountTypeFormData } from '#server/types/bank-account'

export default defineEventHandler(async (event) => {
  const body = await readBody<BankAccountTypeFormData>(event)
  const data = saveBankAccountType(body)
  return {
    success: true,
    data,
    message: body.id ? 'Account Type berhasil diperbarui.' : 'Account Type berhasil ditambahkan.',
  }
})

