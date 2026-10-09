import { getPosSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const settings = await getPosSetting()
  return createResponse(settings, 'POS settings retrieved successfully')
})
