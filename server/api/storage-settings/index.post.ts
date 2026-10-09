import { defineEventHandler, readBody } from 'h3'
import { writeJSON } from '~~/server/utils/data'
import type { StorageSetting } from '~~/server/types/storage-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<StorageSetting>(event)
  await writeJSON('storage-settings.json', body)
  return { success: true, data: body }
})

