import { defineEventHandler, getRouterParam, createError } from 'h3'
import { readJSON, writeJSON } from '~~/server/utils/data'
import type { CurrencySetting } from '~~/server/types/currency-setting'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const items = await readJSON<CurrencySetting[]>('currency-settings.json', [])
  const filtered = items.filter((i) => i.id !== id)

  if (filtered.length === items.length) {
    throw createError({ statusCode: 404, statusMessage: 'Currency setting not found' })
  }

  await writeJSON('currency-settings.json', filtered)
  return { success: true, message: 'Currency deleted successfully' }
})

