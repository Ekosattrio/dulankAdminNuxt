import type { Store } from '../../types/store'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search as string || '').toLowerCase().trim()
  const status = query.status as string || ''

  const allStores = await readJSON<Store[]>('stores.json', [])

  let filtered = allStores

  if (search) {
    filtered = filtered.filter(item =>
      item.storeName.toLowerCase().includes(search) ||
      item.userName.toLowerCase().includes(search) ||
      item.address.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.phone.toLowerCase().includes(search)
    )
  }

  if (status) {
    filtered = filtered.filter(item => item.status === status)
  }

  return createResponse(filtered, 'Stores fetched successfully')
})

