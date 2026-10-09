import { defineEventHandler, readBody, createError } from 'h3'
import { readJSON, writeJSON } from '~~/server/utils/data'
import type { PrinterSetting } from '~~/server/types/printer-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PrinterSetting> & { id?: string }>(event)
  if (!body.printerName) {
    throw createError({ statusCode: 400, statusMessage: 'Printer Name is required' })
  }

  const items = await readJSON<PrinterSetting[]>('printer-settings.json', [])
  
  if (body.id) {
    const idx = items.findIndex((i) => i.id === body.id)
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        ...body,
        port: body.port ? Number(body.port) : 9100
      } as PrinterSetting
      await writeJSON('printer-settings.json', items)
      return { success: true, data: items[idx] }
    }
  }

  const newId = `PRN${String(items.length + 1).padStart(3, '0')}`
  const now = new Date()
  const createdOn = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`

  const newRecord: PrinterSetting = {
    id: newId,
    printerName: body.printerName,
    connectionType: body.connectionType || 'Network',
    ipAddress: body.ipAddress || '',
    port: body.port ? Number(body.port) : 9100,
    status: body.status || 'active',
    createdOn
  }

  items.unshift(newRecord)
  await writeJSON('printer-settings.json', items)

  return { success: true, data: newRecord }
})

