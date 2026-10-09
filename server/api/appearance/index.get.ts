import { getAppearanceSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const data = await getAppearanceSetting()
  return { success: true, data }
})
