import type { SupportTicket } from '~/types/support-ticket'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const items = await readJSON<SupportTicket[]>('support-tickets.json', [])

  const nextId = String(1500 + items.length + 1)
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  const createdDate = `${dd}/${mm}/${yyyy}`

  const due = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
  const dueDd = String(due.getDate()).padStart(2, '0')
  const dueMm = String(due.getMonth() + 1).padStart(2, '0')
  const dueYyyy = due.getFullYear()
  const dueDate = `${dueDd}/${dueMm}/${dueYyyy}`

  const newTicket: SupportTicket = {
    id: nextId,
    ticketNo: `#${nextId}`,
    requestedBy: body.customerName || body.requestedBy || 'Customer',
    customerEmail: body.email || body.customerEmail || '',
    customerPhone: body.phone || body.customerPhone || '',
    avatar: body.avatar || '/assets/img/users/user-23.jpg',
    address: body.address || '',
    city: body.city || '',
    country: body.country || 'Indonesia',
    subject: body.subject || body.description?.slice(0, 40) || 'General Support Ticket',
    assignee: body.assignee || 'Desman Dwi',
    priority: body.priority || 'Medium',
    status: 'Open',
    createdDate,
    dueDate,
    description: body.description || body.descriptions || '',
    tags: body.tags || ['Customer Support'],
    activities: [
      {
        type: 'created',
        title: 'Ticket Created',
        description: 'Ticket created via Dulank Admin.',
        author: body.customerName || 'Customer',
        timeAgo: 'Just now'
      }
    ],
    chat: []
  }

  items.unshift(newTicket)
  await writeJSON('support-tickets.json', items)

  return {
    success: true,
    data: newTicket,
    message: 'Support ticket successfully created'
  }
})
