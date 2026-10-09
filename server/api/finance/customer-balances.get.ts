import { defineEventHandler } from 'h3'
import { getCustomerBalanceRows } from '#server/utils/financeReportData'
export default defineEventHandler(() => ({ success: true, data: getCustomerBalanceRows() }))
