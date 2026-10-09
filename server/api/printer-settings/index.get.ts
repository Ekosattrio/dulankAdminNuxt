import { defineEventHandler } from 'h3'
import { readJSON } from '~~/server/utils/data'
import type { PrinterSetting } from '~~/server/types/printer-setting'

export default defineEventHandler(async () => {
  try {
    const items = await readJSON<PrinterSetting[]>('printer-settings.json', [])
    return {
      success: true,
      data: items
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load printer settings',
      data: []
    }
  }
})

