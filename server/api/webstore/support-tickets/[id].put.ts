import type { SupportTicketUpdateCommand } from '#server/types/support-ticket'
import { updateSupportTicket } from '#server/utils/supportTickets'

export default defineEventHandler(async (event) => ({
  success: true,
  data: await updateSupportTicket(getRouterParam(event, 'id') || '', await readBody<SupportTicketUpdateCommand>(event)),
  message: 'Support ticket updated successfully',
}))
