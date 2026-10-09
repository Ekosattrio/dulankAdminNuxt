import type { CustomerFilterParams } from '~/types/customer'
import { getCustomers } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as CustomerFilterParams
  const { customers, total } = await getCustomers(query)

  return createResponse(customers, { total })
})
