import { defineEventHandler, readBody } from 'h3'
import { writeJSON } from '~~/server/utils/data'
import type { GdprSetting } from '~~/server/types/gdpr-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<GdprSetting>(event)
  await writeJSON('gdpr-settings.json', body)
  return { success: true, data: body }
})

