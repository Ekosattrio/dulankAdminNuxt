import type {
  SupportTicket,
  SupportTicketCommand,
  SupportTicketFilterQuery,
  SupportTicketStats,
  SupportTicketUpdateCommand,
} from '../types/support-ticket'
import { isDateWithinRange } from './dateRange'

const priorities = new Set(['High', 'Medium', 'Low'])
const statuses = new Set(['Open', 'Closed', 'Pending'])

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function required(value: unknown, label: string) {
  const result = clean(value)
  if (!result) throw createError({ statusCode: 400, statusMessage: `${label} is required` })
  return result
}

function formatLegacyDate(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

async function readTickets() {
  return readJSON<SupportTicket[]>('support-tickets.json', [])
}

function findTicketIndex(items: SupportTicket[], id: string) {
  return items.findIndex(ticket => ticket.id === id || ticket.ticketNo === id || `#${ticket.id}` === id)
}

export async function listSupportTickets(query: SupportTicketFilterQuery) {
  const items = await readTickets()
  const stats: SupportTicketStats = {
    totalTickets: items.length,
    totalPendingTickets: items.filter(item => item.status === 'Pending').length,
    totalClosedTickets: items.filter(item => item.status === 'Closed').length,
    totalDeleteTickets: 0,
  }
  const search = query.search?.trim().toLowerCase()
  const hasRange = Boolean(query.startDate && query.endDate)
  const data = items.filter((item) =>
    (!search || [item.ticketNo, item.id, item.requestedBy, item.subject, item.assignee, item.customerEmail].some(value => value.toLowerCase().includes(search)))
    && (!query.priority || query.priority === 'All' || query.priority === 'All Priority' || item.priority.toLowerCase() === query.priority.toLowerCase())
    && (!query.status || query.status === 'All' || query.status === 'All Status' || item.status.toLowerCase() === query.status.toLowerCase())
    && (!hasRange || isDateWithinRange(item.createdDate, query.startDate!, query.endDate!)),
  )
  return { data, stats }
}

export async function getSupportTicket(id: string) {
  const items = await readTickets()
  const ticket = items.find(item => item.id === id || item.ticketNo === id || `#${item.id}` === id)
  if (!ticket) throw createError({ statusCode: 404, statusMessage: 'Ticket not found' })
  return ticket
}

export async function createSupportTicket(command: SupportTicketCommand) {
  const items = await readTickets()
  const customerName = required(command.customerName, 'Customer name')
  const email = required(command.email, 'Email')
  const description = required(command.descriptions, 'Descriptions')
  if (!/^\S+@\S+\.\S+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'Email is invalid' })
  if (description.length > 60) throw createError({ statusCode: 400, statusMessage: 'Descriptions must not exceed 60 characters' })
  const nextNumber = Math.max(1500, ...items.map(item => Number(item.id)).filter(Number.isFinite)) + 1
  const now = new Date()
  const due = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
  const ticket: SupportTicket = {
    id: String(nextNumber),
    ticketNo: `#${nextNumber}`,
    requestedBy: customerName,
    customerEmail: email,
    customerPhone: clean(command.phone),
    avatar: clean(command.avatar) || '/assets/img/users/user-23.jpg',
    address: clean(command.address),
    city: clean(command.city),
    country: clean(command.country),
    subject: description,
    assignee: 'Desman Dwi',
    priority: 'Medium',
    status: 'Open',
    createdDate: formatLegacyDate(now),
    dueDate: formatLegacyDate(due),
    description,
    tags: ['Customer Support'],
    activities: [{ type: 'created', title: 'Ticket Created', description: 'Ticket created via Dulank Admin.', author: customerName, timeAgo: 'Just now' }],
    chat: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
  items.unshift(ticket)
  await writeJSON('support-tickets.json', items)
  return ticket
}

export async function updateSupportTicket(id: string, command: SupportTicketUpdateCommand) {
  const items = await readTickets()
  const index = findTicketIndex(items, id)
  if (index < 0) throw createError({ statusCode: 404, statusMessage: 'Ticket not found' })
  const current = items[index]!
  if (command.status && !statuses.has(command.status)) throw createError({ statusCode: 400, statusMessage: 'Status is invalid' })
  if (command.priority && !priorities.has(command.priority)) throw createError({ statusCode: 400, statusMessage: 'Priority is invalid' })
  if (command.customerEmail && !/^\S+@\S+\.\S+$/.test(command.customerEmail)) throw createError({ statusCode: 400, statusMessage: 'Email is invalid' })
  if (command.description && command.description.trim().length > 60 && command.description.trim() !== current.description?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Descriptions must not exceed 60 characters' })
  }

  const updated: SupportTicket = {
    ...current,
    requestedBy: clean(command.requestedBy) || current.requestedBy,
    customerEmail: clean(command.customerEmail) || current.customerEmail,
    customerPhone: command.customerPhone === undefined ? current.customerPhone : clean(command.customerPhone),
    avatar: command.avatar === undefined ? current.avatar : clean(command.avatar),
    address: command.address === undefined ? current.address : clean(command.address),
    city: command.city === undefined ? current.city : clean(command.city),
    country: command.country === undefined ? current.country : clean(command.country),
    subject: clean(command.subject) || current.subject,
    assignee: clean(command.assignee) || current.assignee,
    priority: command.priority || current.priority,
    status: command.status || current.status,
    description: command.description === undefined ? current.description : clean(command.description),
    updatedAt: new Date().toISOString(),
  }
  if (command.newMessage?.trim()) {
    updated.chat = [...(updated.chat || []), {
      id: `c_${Date.now()}`,
      senderName: clean(command.senderName) || 'Admin',
      isMe: true,
      message: command.newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]
  }
  if (command.status && command.status !== current.status) {
    updated.activities = [...(updated.activities || []), {
      type: 'status',
      title: `Status Changed to "${command.status}"`,
      description: `Ticket status changed from ${current.status} to ${command.status}.`,
      author: clean(command.senderName) || 'Admin',
      timeAgo: 'Just now',
    }]
  }
  items[index] = updated
  await writeJSON('support-tickets.json', items)
  return updated
}

export async function deleteSupportTicket(id: string) {
  const items = await readTickets()
  const index = findTicketIndex(items, id)
  if (index < 0) throw createError({ statusCode: 404, statusMessage: 'Ticket not found' })
  const [deleted] = items.splice(index, 1)
  await writeJSON('support-tickets.json', items)
  return deleted!
}
