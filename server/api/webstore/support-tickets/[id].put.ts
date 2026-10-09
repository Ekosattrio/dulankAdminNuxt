import type { SupportTicket } from '~/types/support-ticket'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const items = await readJSON<SupportTicket[]>('support-tickets.json', [])

  const index = items.findIndex(t => t.id === id || t.ticketNo === id || `#${t.id}` === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Ticket not found' })
  }

  const ticket = items[index]
  if (!ticket) {
    throw createError({ statusCode: 404, statusMessage: 'Ticket not found' })
  }

  if (body.status) ticket.status = body.status
  if (body.priority) ticket.priority = body.priority
  if (body.assignee) ticket.assignee = body.assignee
  if (body.subject) ticket.subject = body.subject
  if (body.description) ticket.description = body.description

  if (body.newMessage) {
    ticket.chat = ticket.chat || []
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ticket.chat.push({
      id: `c_${Date.now()}`,
      senderName: body.senderName || 'Admin',
      isMe: true,
      message: body.newMessage,
      time
    })
  }

  items[index] = ticket
  await writeJSON('support-tickets.json', items)

  return {
    success: true,
    data: ticket,
    message: 'Support ticket updated successfully'
  }
})
