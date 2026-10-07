import type { ClientItem } from '#server/types/client'

export default defineEventHandler(async () => {
  const allClients = await readJSON<ClientItem[]>('clients.json', [])
  return createResponse(allClients, 'Clients fetched successfully')
})
