import { reorderClients } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ order: string[] }>(event)
  const reordered = await reorderClients(body?.order)

  return createResponse(reordered, 'Client order updated successfully')
})
