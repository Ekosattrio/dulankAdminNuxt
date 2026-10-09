import type { InvoiceSetting } from '#server/types/invoice-setting'
import { saveInvoiceSettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<InvoiceSetting>(event)
  const updatedSetting = saveInvoiceSettings(body)
  return createResponse(updatedSetting, 'Invoice settings saved successfully')
})
