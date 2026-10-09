import type { LocalizationConfig } from '#server/types/system-settings'
import { saveLocalizationSettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<LocalizationConfig>(event)
  const saved = saveLocalizationSettings(body)

  return {
    success: true,
    data: saved,
    message: 'Pengaturan lokalisasi berhasil diperbarui',
  }
})
