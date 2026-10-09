import { defineEventHandler, readBody } from 'h3'
import { writeJSON } from '~~/server/utils/data'
import type { PreferenceItem } from '~~/server/types/preference-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<PreferenceItem[]>(event)
  await writeJSON('preference-settings.json', body)
  return { success: true, data: body }
})

