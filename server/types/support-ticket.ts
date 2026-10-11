export interface SupportTicketActivity {
  id?: string
  type: string
  title: string
  description: string
  author: string
  timeAgo: string
  statusColor?: string
}

export interface SupportTicketChatMessage {
  id: string
  senderName: string
  senderAvatar?: string
  isMe: boolean
  message: string
  time: string
}

export interface SupportTicket {
  id: string
  ticketNo: string
  customerId?: string
  requestedBy: string
  customerEmail: string
  customerPhone?: string
  avatar?: string
  address?: string
  city?: string
  country?: string
  subject: string
  assignee: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Open' | 'Closed' | 'Pending'
  createdDate: string
  dueDate: string
  description?: string
  tags?: string[]
  activities?: SupportTicketActivity[]
  chat?: SupportTicketChatMessage[]
  createdAt?: string
  updatedAt?: string
}

export interface SupportTicketCommand {
  customerName: string
  email: string
  phone?: string
  avatar?: string
  address?: string
  city?: string
  country?: string
  descriptions: string
}

export interface SupportTicketUpdateCommand {
  requestedBy?: string
  customerEmail?: string
  customerPhone?: string
  avatar?: string
  address?: string
  city?: string
  country?: string
  subject?: string
  assignee?: string
  priority?: SupportTicket['priority']
  status?: SupportTicket['status']
  description?: string
  newMessage?: string
  senderName?: string
}

export interface SupportTicketStats {
  totalTickets: number
  totalPendingTickets: number
  totalClosedTickets: number
  totalDeleteTickets: number
}

export interface SupportTicketFilterQuery {
  search?: string
  priority?: string
  status?: string
  startDate?: string
  endDate?: string
}
