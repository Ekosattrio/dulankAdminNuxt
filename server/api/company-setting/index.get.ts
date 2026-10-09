import { getCompanySetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const current = await getCompanySetting()
  return createResponse(current, 'Pengaturan perusahaan berhasil dimuat')
})
