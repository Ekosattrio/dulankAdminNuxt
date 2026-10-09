import type { SystemIntegrations } from '#server/types/system-integrations'
import { saveSystemIntegrations } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<SystemIntegrations>>(event)
  const merged = saveSystemIntegrations(body || {})

  return {
    success: true,
    data: merged,
    message: 'Pengaturan integrasi sistem berhasil diperbarui',
  }
})
