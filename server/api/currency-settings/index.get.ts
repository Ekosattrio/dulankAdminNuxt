import { defineEventHandler } from 'h3'
import { readJSON } from '~~/server/utils/data'
import type { CurrencySetting } from '~~/server/types/currency-setting'

export default defineEventHandler(async () => {
  try {
    const items = await readJSON<CurrencySetting[]>('currency-settings.json', [])
    return {
      success: true,
      data: items
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load currency settings',
      data: []
    }
  }
})

