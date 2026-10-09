import type { AddressFilterParams } from '~/types/address'
import { getFilteredAddresses } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as AddressFilterParams
  const result = await getFilteredAddresses(query)

  return result
})
