import { defineEventHandler } from 'h3'
import { readJSON } from '#server/utils/data'
import type { SystemIntegrations } from '#server/types/system-integrations'

const FILE_NAME = 'system-integrations.json'

export default defineEventHandler(async () => {
  const data = readJSON<SystemIntegrations>(FILE_NAME, {
    captcha: { enabled: true, siteKey: '', secretKey: '' },
    analytics: { enabled: true, trackingId: '' },
    adsense: { enabled: false, code: '' },
    map: { enabled: true, mapId: '' }
  })

  return {
    success: true,
    data
  }
})

