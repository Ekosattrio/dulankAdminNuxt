import type { PreferenceItem } from '#server/types/preference-setting'
import { savePreferences } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<PreferenceItem[]>(event)
  const saved = savePreferences(body || [])
  return { success: true, data: saved }
})
