import { readData, writeData } from '~/server/utils/data'
import type { LanguageItem, LanguageFormData } from '~/types/system-settings'

export default defineEventHandler(async (event) => {
  const body = await readBody<LanguageFormData>(event)

  if (!body.code || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kode bahasa dan nama bahasa wajib diisi.',
    })
  }

  const items = readData<LanguageItem>('languages.json')
  const now = new Date().toISOString().split('T')[0]

  if (body.id) {
    const idx = items.findIndex((l) => l.id === body.id)
    if (idx !== -1 && items[idx]) {
      const existing = items[idx]!
      const totalKeys = body.totalKeys !== undefined ? Number(body.totalKeys) : existing.totalKeys
      const doneKeys = body.doneKeys !== undefined ? Number(body.doneKeys) : existing.doneKeys
      const progress = totalKeys > 0 ? Math.round((doneKeys / totalKeys) * 100) : 0

      items[idx] = {
        ...existing,
        ...body,
        totalKeys,
        doneKeys,
        progress,
        updatedAt: now,
      } as LanguageItem

      writeData('languages.json', items)

      return {
        success: true,
        data: items[idx],
        message: `Bahasa ${items[idx].name} berhasil diperbarui.`,
      }
    }
  }

  // Check code uniqueness for create
  const exists = items.some((l) => l.code.toLowerCase() === body.code.toLowerCase())
  if (exists) {
    throw createError({
      statusCode: 409,
      statusMessage: `Kode bahasa '${body.code}' sudah terdaftar.`,
    })
  }

  const nextId = `LANG-${String(items.length + 1).padStart(2, '0')}`
  const totalKeys = body.totalKeys ? Number(body.totalKeys) : 2145
  const doneKeys = body.doneKeys ? Number(body.doneKeys) : 0
  const progress = totalKeys > 0 ? Math.round((doneKeys / totalKeys) * 100) : 0

  const newLang: LanguageItem = {
    id: nextId,
    code: body.code.toLowerCase(),
    name: body.name,
    flag: body.flag || '/assets/img/icons/flag-01.svg',
    rtl: Boolean(body.rtl),
    totalKeys,
    doneKeys,
    progress,
    status: body.status || 'active',
    isDefault: Boolean(body.isDefault),
    createdAt: now,
    updatedAt: now,
  }

  items.push(newLang)
  writeData('languages.json', items)

  return {
    success: true,
    data: newLang,
    message: `Bahasa ${newLang.name} berhasil ditambahkan.`,
  }
})
