import type { SupportTicket, SupportTicketStats } from '~/types/support-ticket'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = await readJSON<SupportTicket[]>('support-tickets.json', [])

  const totalTickets = items.length
  const totalPendingTickets = items.filter(i => i.status === 'Pending').length
  const totalClosedTickets = items.filter(i => i.status === 'Closed').length
  const totalDeleteTickets = items.filter(i => (i.status as string) === 'Delete' || (i.status as string) === 'Deleted').length

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(item =>
      (item.ticketNo && item.ticketNo.toLowerCase().includes(s)) ||
      (item.id && item.id.toLowerCase().includes(s)) ||
      (item.requestedBy && item.requestedBy.toLowerCase().includes(s)) ||
      (item.subject && item.subject.toLowerCase().includes(s)) ||
      (item.assignee && item.assignee.toLowerCase().includes(s)) ||
      (item.customerEmail && item.customerEmail.toLowerCase().includes(s))
    )
  }

  if (query.priority && query.priority !== 'All' && query.priority !== 'All Priority') {
    filtered = filtered.filter(item => item.priority.toLowerCase() === String(query.priority).toLowerCase())
  }

  if (query.status && query.status !== 'All' && query.status !== 'All Status') {
    filtered = filtered.filter(item => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  if (query.startDate && query.endDate) {
    filtered = filtered.filter(item => isDateInRange(item.createdDate, String(query.startDate), String(query.endDate)))
  }

  return {
    success: true,
    data: filtered,
    stats: {
      totalTickets,
      totalPendingTickets,
      totalClosedTickets,
      totalDeleteTickets
    } satisfies SupportTicketStats
  }
})
