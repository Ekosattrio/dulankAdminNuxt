import { getContactForms } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await getContactForms({
    search: query.search as string,
    status: query.status as string,
  })

  return {
    success: true,
    data: items,
  }
})
