import { getClients } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const clients = await getClients({
    search: query.search as string,
    status: query.status as string,
    category: query.category as string,
  })

  return createResponse(clients, 'Clients fetched successfully')
})
