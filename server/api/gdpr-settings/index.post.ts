import type { GdprSetting } from '#server/types/gdpr-setting'
import { saveGdprSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<GdprSetting>(event)
  const saved = saveGdprSetting(body)
  return { success: true, data: saved }
})
