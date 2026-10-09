import type { ClientFormData } from '#server/types/client'
import { saveClient } from '~~/server/utils/contentDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<ClientFormData>(event)
  const client = await saveClient(body)

  return createResponse(
    client,
    body?.id ? 'Client updated successfully' : 'Client created successfully'
  )
})
