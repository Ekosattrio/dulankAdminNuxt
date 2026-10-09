import { defineEventHandler } from 'h3'
import { getBankAccountTypes } from '#server/utils/bankAccountData'

export default defineEventHandler(() => ({ success: true, data: getBankAccountTypes() }))

