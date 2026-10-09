import { deletePrinterSetting } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const result = await deletePrinterSetting(id || '')

  return { success: true, message: `Printer setting ${result.id} deleted` }
})
