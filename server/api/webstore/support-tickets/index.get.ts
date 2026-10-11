import type { SupportTicketFilterQuery } from '#server/types/support-ticket'
import { listSupportTickets } from '#server/utils/supportTickets'

export default defineEventHandler(async (event) => {
  const result = await listSupportTickets(getQuery(event) as SupportTicketFilterQuery)
  return { success: true, ...result }
})
