import { readData } from '~/server/utils/data'
import type { LanguageItem } from '~/types/system-settings'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = String(query.search || '').trim().toLowerCase()
  const status = String(query.status || '').trim().toLowerCase()

  let languages = readData<LanguageItem>('languages.json')

  if (search) {
    languages = languages.filter((lang) =>
      lang.name.toLowerCase().includes(search) ||
      lang.code.toLowerCase().includes(search),
    )
  }

  if (status && status !== 'all') {
    languages = languages.filter((lang) => lang.status.toLowerCase() === status)
  }

  return {
    success: true,
    data: languages,
  }
})
