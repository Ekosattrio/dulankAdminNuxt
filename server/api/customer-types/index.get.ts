import type { CustomerType } from '~/types/customer-type'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''

  const allTypes = await readJSON<CustomerType[]>('customer-types.json', [])

  let filtered = allTypes

  if (search) {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(search))
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return createResponse(filtered, 'Customer types fetched successfully')
})

