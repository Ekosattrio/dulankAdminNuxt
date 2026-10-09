import { getCalendarConfig } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const data = await getCalendarConfig()
  return { success: true, data }
})
