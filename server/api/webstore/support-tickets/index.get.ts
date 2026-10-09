import { getSupportTickets } from '~~/server/utils/webstoreDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await getSupportTickets({
    search: query.search as string,
    status: query.status as string,
    priority: query.priority as string,
  })

  return {
    success: true,
    data: items,
  }
})
