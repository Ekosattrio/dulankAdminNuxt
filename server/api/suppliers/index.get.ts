import { getSuppliers } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const suppliers = await getSuppliers({
    search: query.search as string,
    status: query.status as string,
  })

  return createResponse(suppliers, 'Suppliers fetched successfully')
})
