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

  const totalKeys = body.totalKeys !== undefined ? Number(body.totalKeys) : undefined
  const doneKeys = body.doneKeys !== undefined ? Number(body.doneKeys) : undefined
  if (
    (totalKeys !== undefined && (!Number.isInteger(totalKeys) || totalKeys < 0)) ||
    (doneKeys !== undefined && (!Number.isInteger(doneKeys) || doneKeys < 0))
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Total dan jumlah terjemahan harus berupa bilangan bulat positif.' })
  }
  if (totalKeys !== undefined && doneKeys !== undefined && doneKeys > totalKeys) {
    throw createError({ statusCode: 400, statusMessage: 'Jumlah terjemahan selesai tidak boleh melebihi total key.' })
  }

  if (body.id) {
    const idx = items.findIndex((l) => l.id === body.id)
    if (idx !== -1 && items[idx]) {
      const existing = items[idx]!
      const duplicateCode = items.some((l) => l.id !== body.id && l.code.toLowerCase() === body.code.toLowerCase())
      if (duplicateCode) {
        throw createError({ statusCode: 409, statusMessage: `Kode bahasa '${body.code}' sudah terdaftar.` })
      }
      const nextTotalKeys = totalKeys ?? existing.totalKeys
      const nextDoneKeys = doneKeys ?? existing.doneKeys
      if (nextDoneKeys > nextTotalKeys) {
        throw createError({ statusCode: 400, statusMessage: 'Jumlah terjemahan selesai tidak boleh melebihi total key.' })
      }
      const progress = nextTotalKeys > 0 ? Math.round((nextDoneKeys / nextTotalKeys) * 100) : 0

      if (body.isDefault) {
        items.forEach((item) => {
          item.isDefault = item.id === body.id
        })
      }

      items[idx] = {
        ...existing,
        ...body,
        code: body.code.toLowerCase(),
        totalKeys: nextTotalKeys,
        doneKeys: nextDoneKeys,
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

    throw createError({ statusCode: 404, statusMessage: 'Bahasa tidak ditemukan.' })
  }

  // Check code uniqueness for create
  const exists = items.some((l) => l.code.toLowerCase() === body.code.toLowerCase())
  if (exists) {
    throw createError({
      statusCode: 409,
      statusMessage: `Kode bahasa '${body.code}' sudah terdaftar.`,
    })
  }

  const nextNumber = items.reduce((highest, item) => {
    const numericId = Number(item.id.replace(/^LANG-/i, ''))
    return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest
  }, 0) + 1
  const nextId = `LANG-${String(nextNumber).padStart(2, '0')}`
  const nextTotalKeys = totalKeys ?? 2145
  const nextDoneKeys = doneKeys ?? 0
  if (nextDoneKeys > nextTotalKeys) {
    throw createError({ statusCode: 400, statusMessage: 'Jumlah terjemahan selesai tidak boleh melebihi total key.' })
  }
  const progress = nextTotalKeys > 0 ? Math.round((nextDoneKeys / nextTotalKeys) * 100) : 0

  if (body.isDefault) {
    items.forEach((item) => {
      item.isDefault = false
    })
  }

  const newLang: LanguageItem = {
    id: nextId,
    code: body.code.toLowerCase(),
    name: body.name,
    flag: body.flag || '/assets/img/icons/flag-01.svg',
    rtl: Boolean(body.rtl),
    totalKeys: nextTotalKeys,
    doneKeys: nextDoneKeys,
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
