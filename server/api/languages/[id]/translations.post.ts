import { readData, writeData } from '~/server/utils/data'
import type { LanguageItem, LanguageTranslationDocument } from '~/types/system-settings'

function countTranslationLeaves(value: unknown): number {
  if (value === null || value === undefined) return 0
  if (typeof value === 'string') return value.trim() ? 1 : 0
  if (typeof value !== 'object') return 1
  if (Array.isArray(value)) return value.reduce((total, item) => total + countTranslationLeaves(item), 0)
  return Object.values(value).reduce((total, item) => total + countTranslationLeaves(item), 0)
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ translations?: Record<string, unknown> }>(event)
  if (!body.translations || typeof body.translations !== 'object' || Array.isArray(body.translations)) {
    throw createError({ statusCode: 400, statusMessage: 'File terjemahan harus berupa object JSON.' })
  }

  const languages = readData<LanguageItem>('languages.json')
  const languageIndex = languages.findIndex((item) => item.id === id || item.code === id)
  if (languageIndex < 0 || !languages[languageIndex]) {
    throw createError({ statusCode: 404, statusMessage: 'Bahasa tidak ditemukan.' })
  }

  const language = languages[languageIndex]
  const documents = readData<LanguageTranslationDocument>('language-translations.json')
  const documentIndex = documents.findIndex((item) => item.languageId === language.id)
  const now = new Date().toISOString()
  const document: LanguageTranslationDocument = {
    languageId: language.id,
    code: language.code,
    translations: body.translations,
    updatedAt: now,
  }

  if (documentIndex >= 0) documents[documentIndex] = document
  else documents.push(document)

  const doneKeys = countTranslationLeaves(body.translations)
  const totalKeys = Math.max(language.totalKeys, doneKeys)
  languages[languageIndex] = {
    ...language,
    totalKeys,
    doneKeys,
    progress: totalKeys > 0 ? Math.round((doneKeys / totalKeys) * 100) : 0,
    updatedAt: now.split('T')[0],
  }

  writeData('language-translations.json', documents)
  writeData('languages.json', languages)

  return {
    success: true,
    data: document,
    message: `Terjemahan ${language.name} berhasil diimpor (${doneKeys} key).`,
  }
})
