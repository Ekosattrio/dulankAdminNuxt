import { getStores } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const stores = await getStores({
    search: query.search as string,
    status: query.status as string,
  })

  return createResponse(stores, 'Stores fetched successfully')
})
