import { getStorageSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const data = await getStorageSetting()
  return { success: true, data }
})
