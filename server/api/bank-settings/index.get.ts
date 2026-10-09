import { defineEventHandler } from 'h3'
import { readJSON } from '~~/server/utils/data'
import type { BankSetting } from '~~/server/types/bank-setting'

export default defineEventHandler(async () => {
  try {
    const items = await readJSON<BankSetting[]>('bank-settings.json', [])
    return {
      success: true,
      data: items
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load bank settings',
      data: []
    }
  }
})

