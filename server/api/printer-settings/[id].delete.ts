import { defineEventHandler, getRouterParam, createError } from 'h3'
import { readJSON, writeJSON } from '~~/server/utils/data'
import type { PrinterSetting } from '~~/server/types/printer-setting'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const items = await readJSON<PrinterSetting[]>('printer-settings.json', [])
  const filtered = items.filter((i) => i.id !== id)

  if (filtered.length === items.length) {
    throw createError({ statusCode: 404, statusMessage: 'Printer setting not found' })
  }

  await writeJSON('printer-settings.json', filtered)
  return { success: true, message: 'Printer deleted successfully' }
})

