import type { PrinterSetting } from '~~/server/types/printer-setting'
import { savePrinterSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PrinterSetting> & { id?: string }>(event)
  const result = await savePrinterSetting(body)

  return { success: true, data: result }
})
