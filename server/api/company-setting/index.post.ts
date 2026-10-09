import type { CompanySettingUpdatePayload } from '#server/types/company-setting'
import { updateCompanySetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<CompanySettingUpdatePayload>(event)
  const updated = await updateCompanySetting(body)

  return createResponse(updated, 'Pengaturan perusahaan berhasil disimpan')
})
