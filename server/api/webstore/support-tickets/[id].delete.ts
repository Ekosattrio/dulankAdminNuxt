import { deleteSupportTicket } from '#server/utils/supportTickets'

export default defineEventHandler(async (event) => ({
  success: true,
  data: await deleteSupportTicket(getRouterParam(event, 'id') || ''),
  message: 'Support ticket deleted successfully',
}))
