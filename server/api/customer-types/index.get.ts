import { getCustomerTypes } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const types = await getCustomerTypes({
    search: query.search as string,
    status: query.status as string,
  })

  return createResponse(types, 'Customer types fetched successfully')
})
