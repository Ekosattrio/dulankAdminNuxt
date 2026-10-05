import type { Store, StoreFormData } from '../../types/store'

export default defineEventHandler(async (event) => {
  const body = await readBody<StoreFormData>(event)

  if (!body || !body.storeName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Store name is required'
    })
  }

  const allStores = await readJSON<Store[]>('stores.json', [])

  if (body.id) {
    // Update
    const idx = allStores.findIndex(s => s.id === body.id)
    if (idx !== -1) {
      allStores[idx] = {
        ...allStores[idx],
        storeName: body.storeName,
        userName: body.userName || allStores[idx].userName,
        address: body.address || allStores[idx].address,
        phone: body.phone || allStores[idx].phone,
        email: body.email || allStores[idx].email,
        status: body.status || 'Active'
      }
      await writeJSON('stores.json', allStores)
      return createResponse(allStores[idx], 'Store updated successfully')
    }
  }

  // Create
  const newStore: Store = {
    id: String(Date.now()),
    storeName: body.storeName,
    userName: body.userName || 'Admin',
    address: body.address || '',
    phone: body.phone || '',
    email: body.email || '',
    status: body.status || 'Active'
  }

  allStores.unshift(newStore)
  await writeJSON('stores.json', allStores)

  return createResponse(newStore, 'Store created successfully')
})

