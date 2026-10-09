import { defineEventHandler } from 'h3'
import { getCashAdvances } from '#server/utils/cashAdvanceData'
export default defineEventHandler(() => ({ success: true, data: getCashAdvances() }))
