import { getSupportTicket } from '#server/utils/supportTickets'

export default defineEventHandler(async (event) => ({
  success: true,
  data: await getSupportTicket(getRouterParam(event, 'id') || ''),
}))
