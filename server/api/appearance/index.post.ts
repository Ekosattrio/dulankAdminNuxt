import { defineEventHandler, readBody } from 'h3'
import { writeJSON } from '~~/server/utils/data'
import type { AppearanceSetting } from '~~/server/types/appearance-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<AppearanceSetting>(event)
  await writeJSON('appearance-settings.json', body)
  return { success: true, data: body }
})

