import type { Store } from '~/types/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Store ID is required'
    })
  }

  const allStores = await readJSON<Store[]>('stores.json', [])
  const newStores = allStores.filter(s => s.id !== id)

  if (allStores.length === newStores.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Store not found'
    })
  }

  await writeJSON('stores.json', newStores)

  return createResponse({ id }, 'Store deleted successfully')
})

