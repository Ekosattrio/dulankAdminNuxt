import { defineEventHandler, readBody } from 'h3'
import { writeJSON, readJSON } from '#server/utils/data'
import type { SystemIntegrations } from '#server/types/system-integrations'

const FILE_NAME = 'system-integrations.json'

export default defineEventHandler(async (event) => {
  const current = readJSON<SystemIntegrations>(FILE_NAME, {
    captcha: { enabled: true, siteKey: '', secretKey: '' },
    analytics: { enabled: true, trackingId: '' },
    adsense: { enabled: false, code: '' },
    map: { enabled: true, mapId: '' }
  })

  const body = await readBody<Partial<SystemIntegrations>>(event)
  const merged: SystemIntegrations = {
    ...current,
    ...body
  }
  writeJSON(FILE_NAME, merged)

  return {
    success: true,
    data: merged,
    message: 'Pengaturan integrasi sistem berhasil diperbarui'
  }
})

