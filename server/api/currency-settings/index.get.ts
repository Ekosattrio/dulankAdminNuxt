import { getCurrencySettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await getCurrencySettings({
    search: query.search as string,
    status: query.status as string,
  })

  return { success: true, data: items }
})
