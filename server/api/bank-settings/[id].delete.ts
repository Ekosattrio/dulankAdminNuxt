import { defineEventHandler, getRouterParam, createError } from 'h3'
import { readJSON, writeJSON } from '~~/server/utils/data'
import type { BankSetting } from '~~/server/types/bank-setting'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' })
  }

  const items = await readJSON<BankSetting[]>('bank-settings.json', [])
  const filtered = items.filter((i) => i.id !== id)

  if (filtered.length === items.length) {
    throw createError({ statusCode: 404, statusMessage: 'Bank setting not found' })
  }

  await writeJSON('bank-settings.json', filtered)
  return { success: true, message: 'Bank setting deleted successfully' }
})

