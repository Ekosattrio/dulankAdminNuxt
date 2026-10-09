import { getPrinterSettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await getPrinterSettings({
    search: query.search as string,
    status: query.status as string,
  })

  return { success: true, data: items }
})
