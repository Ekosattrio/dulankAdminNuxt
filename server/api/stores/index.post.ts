import type { StoreFormData } from '~~/server/types/store'
import { saveStore } from '~~/server/utils/peoplesDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<StoreFormData>(event)
  const result = await saveStore(body)

  return createResponse(result, body.id ? 'Store updated successfully' : 'Store created successfully')
})
