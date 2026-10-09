import type { AppearanceSetting } from '~~/server/types/appearance-setting'
import { updateAppearanceSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<AppearanceSetting>(event)
  const data = await updateAppearanceSetting(body)
  return { success: true, data }
})
