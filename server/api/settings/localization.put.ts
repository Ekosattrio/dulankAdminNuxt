import { defineEventHandler, readBody } from 'h3'
import { writeJSON } from '#server/utils/data'
import type { LocalizationConfig } from '#server/types/system-settings'

const FILE_NAME = 'localization-settings.json'

export default defineEventHandler(async (event) => {
  const body = await readBody<LocalizationConfig>(event)
  writeJSON(FILE_NAME, body)

  return {
    success: true,
    data: body,
    message: 'Pengaturan lokalisasi berhasil diperbarui'
  }
})

