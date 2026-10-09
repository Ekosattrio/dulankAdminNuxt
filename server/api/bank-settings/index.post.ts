import { defineEventHandler, readBody, createError } from 'h3'
import { readJSON, writeJSON } from '~~/server/utils/data'
import type { BankSetting, BankSettingFormData } from '~~/server/types/bank-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<BankSetting> & { id?: string }>(event)
  if (!body.bankName || !body.accountNumber) {
    throw createError({ statusCode: 400, statusMessage: 'Bank Name and Account Number are required' })
  }

  const items = await readJSON<BankSetting[]>('bank-settings.json', [])
  
  if (body.id) {
    const idx = items.findIndex((i) => i.id === body.id)
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        ...body,
      } as BankSetting
      await writeJSON('bank-settings.json', items)
      return { success: true, data: items[idx] }
    }
  }

  const newId = `BANK${String(items.length + 1).padStart(3, '0')}`
  const now = new Date()
  const createdOn = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`

  const newRecord: BankSetting = {
    id: newId,
    bankName: body.bankName,
    accountName: body.accountName || 'PT. DULANK SEMESTA CIDA',
    accountNumber: body.accountNumber,
    branch: body.branch || '',
    ifscCode: body.ifscCode || '',
    status: body.status || 'active',
    createdOn
  }

  items.unshift(newRecord)
  await writeJSON('bank-settings.json', items)

  return { success: true, data: newRecord }
})

