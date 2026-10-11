import type { ContactFormFilterQuery } from '#server/types/contact-form'
import { listContactForms } from '#server/utils/webstoreLists'

export default defineEventHandler(async (event) => {
  const result = await listContactForms(getQuery(event) as ContactFormFilterQuery)
  return { success: true, ...result }
})
