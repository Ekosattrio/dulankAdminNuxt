import type { SupportTicketCommand } from '#server/types/support-ticket'
import { createSupportTicket } from '#server/utils/supportTickets'

export default defineEventHandler(async (event) => ({
  success: true,
  data: await createSupportTicket(await readBody<SupportTicketCommand>(event)),
  message: 'Support ticket successfully created',
}))
