import type { StorageSetting } from '~~/server/types/storage-setting'
import { updateStorageSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<StorageSetting>(event)
  const data = await updateStorageSetting(body)
  return { success: true, data }
})
