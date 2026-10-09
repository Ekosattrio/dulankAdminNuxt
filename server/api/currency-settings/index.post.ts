import { defineEventHandler, readBody, createError } from 'h3'
import { readJSON, writeJSON } from '~~/server/utils/data'
import type { CurrencySetting } from '~~/server/types/currency-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CurrencySetting> & { id?: string }>(event)
  if (!body.name || !body.code) {
    throw createError({ statusCode: 400, statusMessage: 'Name and Code are required' })
  }

  const items = await readJSON<CurrencySetting[]>('currency-settings.json', [])
  
  if (body.id) {
    const idx = items.findIndex((i) => i.id === body.id)
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        ...body,
        exchangeRate: typeof body.exchangeRate === 'number' ? body.exchangeRate : Number(body.exchangeRate) || 1
      } as CurrencySetting
      await writeJSON('currency-settings.json', items)
      return { success: true, data: items[idx] }
    }
  }

  const newId = `CURR${String(items.length + 1).padStart(3, '0')}`
  const now = new Date()
  const createdOn = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`

  const newRecord: CurrencySetting = {
    id: newId,
    name: body.name,
    code: body.code.toUpperCase(),
    symbol: body.symbol || body.code,
    exchangeRate: typeof body.exchangeRate === 'number' ? body.exchangeRate : Number(body.exchangeRate) || 1,
    isDefault: !!body.isDefault,
    status: body.status || 'active',
    createdOn
  }

  items.unshift(newRecord)
  await writeJSON('currency-settings.json', items)

  return { success: true, data: newRecord }
})

