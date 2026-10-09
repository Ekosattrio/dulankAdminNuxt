import { readData, writeData } from '~/server/utils/data'
import type { LanguageItem, LanguageTranslationDocument } from '~/types/system-settings'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<LanguageItem>('languages.json')

  const target = items.find((l) => l.id === id || l.code === id)
  if (!target) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Bahasa tidak ditemukan.',
    })
  }

  if (target.isDefault) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bahasa default sistem tidak dapat dihapus.',
    })
  }

  const updated = items.filter((l) => l.id !== target.id)
  writeData('languages.json', updated)

  const translations = readData<LanguageTranslationDocument>('language-translations.json')
  const remainingTranslations = translations.filter((item) => item.languageId !== target.id)
  if (remainingTranslations.length !== translations.length) {
    writeData('language-translations.json', remainingTranslations)
  }

  return {
    success: true,
    data: { id: target.id },
    message: `Bahasa ${target.name} berhasil dihapus.`,
  }
})
