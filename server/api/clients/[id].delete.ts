import type { ClientItem } from '#server/types/client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Client ID is required'
    })
  }

  const allClients = await readJSON<ClientItem[]>('clients.json', [])
  const newClients = allClients.filter(item => item.id !== id)

  if (allClients.length === newClients.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Client not found'
    })
  }

  await writeJSON('clients.json', newClients)

  return createResponse({ id }, 'Client deleted successfully')
})
