import type { ClientItem } from '#server/types/client'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ order: string[] }>(event)
  if (!body?.order || !Array.isArray(body.order)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid order list',
    })
  }

  const allClients = await readJSON<ClientItem[]>('clients.json', [])
  const clientMap = new Map(allClients.map(c => [c.id, c]))

  const reordered: ClientItem[] = []
  body.order.forEach((id, idx) => {
    const item = clientMap.get(id)
    if (item) {
      item.order = idx + 1
      reordered.push(item)
      clientMap.delete(id)
    }
  })

  // Append any remaining items that weren't in the order array
  clientMap.forEach(item => {
    item.order = reordered.length + 1
    reordered.push(item)
  })

  await writeJSON('clients.json', reordered)
  return createResponse(reordered, 'Client order updated successfully')
})
