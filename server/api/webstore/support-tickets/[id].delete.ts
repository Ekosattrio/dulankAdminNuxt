import type { SupportTicket } from '~/types/support-ticket'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = await readJSON<SupportTicket[]>('support-tickets.json', [])

  const initialLength = items.length
  const filtered = items.filter(t => t.id !== id && t.ticketNo !== id && `#${t.id}` !== id)

  if (filtered.length === initialLength) {
    throw createError({ statusCode: 404, statusMessage: 'Ticket not found' })
  }

  await writeJSON('support-tickets.json', filtered)

  return {
    success: true,
    message: 'Support ticket deleted successfully'
  }
})
