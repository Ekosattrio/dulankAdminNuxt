import type { ClientItem, ClientFormData } from '#server/types/client'

export default defineEventHandler(async (event) => {
  const body = await readBody<ClientFormData>(event)

  if (!body || !body.name || !body.logoUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Client name and logo URL are required'
    })
  }

  const allClients = await readJSON<ClientItem[]>('clients.json', [])

  if (body.id) {
    const idx = allClients.findIndex(item => item.id === body.id)
    if (idx !== -1) {
      const current = allClients[idx]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Client not found' })
      const updated: ClientItem = {
        ...current,
        name: body.name,
        logoUrl: body.logoUrl,
        website: body.website ?? current.website,
        category: body.category || current.category || 'General',
        status: body.status || current.status || 'Active',
        order: body.order !== undefined ? Number(body.order) : current.order
      }
      allClients[idx] = updated
      await writeJSON('clients.json', allClients)
      return createResponse(updated, 'Client updated successfully')
    }
  }

  const nextOrder = allClients.length > 0 ? Math.max(...allClients.map(c => c.order || 0)) + 1 : 1
  const newClient: ClientItem = {
    id: `cli-${Date.now()}`,
    name: body.name,
    logoUrl: body.logoUrl,
    website: body.website || '',
    category: body.category || 'General',
    status: body.status || 'Active',
    order: body.order !== undefined ? Number(body.order) : nextOrder,
    createdDate: new Date().toISOString().slice(0, 10)
  }

  allClients.push(newClient)
  await writeJSON('clients.json', allClients)

  return createResponse(newClient, 'Client created successfully')
})
