import { getInvoiceSettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  const settings = getInvoiceSettings()
  return createResponse(settings, 'Invoice settings retrieved successfully')
})
