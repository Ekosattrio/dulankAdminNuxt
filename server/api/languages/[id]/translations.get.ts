import { readData } from '~/server/utils/data'
import type { LanguageItem, LanguageTranslationDocument } from '~/types/system-settings'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const language = readData<LanguageItem>('languages.json').find((item) => item.id === id || item.code === id)

  if (!language) {
    throw createError({ statusCode: 404, statusMessage: 'Bahasa tidak ditemukan.' })
  }

  const stored = readData<LanguageTranslationDocument>('language-translations.json')
    .find((item) => item.languageId === language.id)

  return {
    success: true,
    data: stored || {
      languageId: language.id,
      code: language.code,
      translations: {},
      updatedAt: language.updatedAt || language.createdAt || '',
    },
  }
})
