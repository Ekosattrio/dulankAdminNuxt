import { getBankSettings } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await getBankSettings({
    search: query.search as string,
    status: query.status as string,
  })

  return { success: true, data: items }
})
