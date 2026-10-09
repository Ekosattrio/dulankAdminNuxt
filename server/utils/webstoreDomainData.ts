import type { SupportTicket } from '~/types/support-ticket'
import type { ContactFormItem } from '~/types/contact-form'
import type { CartItem, CartStats } from '~/types/cart'
import type { CheckoutItem, CheckoutStats } from '~/types/checkout'
import type { ReviewItem, ReviewStats } from '~/types/review'
import type { WishlistItem, WishlistStats } from '~/types/wishlist'
import { isDateWithinRange } from '#server/utils/dateRange'
import { readJSON, writeJSON } from './data'

// ----------------- Support Tickets -----------------

export async function getSupportTickets(query?: { search?: string; status?: string; priority?: string }): Promise<SupportTicket[]> {
  const items = await readJSON<SupportTicket[]>('support-tickets.json', [])
  let filtered = items

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''
  const priority = query?.priority || ''

  if (search) {
    filtered = filtered.filter(item =>
      (item.ticketNo && item.ticketNo.toLowerCase().includes(search)) ||
      (item.subject && item.subject.toLowerCase().includes(search)) ||
      (item.requestedBy && item.requestedBy.toLowerCase().includes(search)) ||
      (item.customerEmail && item.customerEmail.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'all' && status !== 'All') {
    filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase())
  }

  if (priority && priority !== 'all' && priority !== 'All') {
    filtered = filtered.filter(item => item.priority.toLowerCase() === priority.toLowerCase())
  }

  return filtered
}

export async function createSupportTicket(body: any): Promise<SupportTicket> {
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
    requestedBy: body?.customerName || body?.requestedBy || 'Customer',
    customerEmail: body?.email || body?.customerEmail || '',
    customerPhone: body?.phone || body?.customerPhone || '',
    avatar: body?.avatar || '/assets/img/users/user-23.jpg',
    address: body?.address || '',
    city: body?.city || '',
    country: body?.country || 'Indonesia',
    subject: body?.subject || body?.description?.slice(0, 40) || 'General Support Ticket',
    assignee: body?.assignee || 'Desman Dwi',
    priority: body?.priority || 'Medium',
    status: 'Open',
    createdDate,
    dueDate,
    description: body?.description || body?.descriptions || '',
    tags: body?.tags || ['Customer Support'],
    activities: [
      {
        type: 'created',
        title: 'Ticket Created',
        description: 'Ticket created via Dulank Admin.',
        author: body?.customerName || 'Customer',
        timeAgo: 'Just now',
      },
    ],
    chat: [],
  }

  items.unshift(newTicket)
  await writeJSON('support-tickets.json', items)
  return newTicket
}

export async function updateSupportTicket(id: string, body: any): Promise<SupportTicket> {
  const items = await readJSON<SupportTicket[]>('support-tickets.json', [])
  const index = items.findIndex(t => t.id === id || t.ticketNo === id || `#${t.id}` === id)

  if (index === -1 || !items[index]) {
    throw createError({ statusCode: 404, statusMessage: 'Ticket not found' })
  }

  const ticket = items[index]!
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
      time,
    })
  }

  items[index] = ticket
  await writeJSON('support-tickets.json', items)
  return ticket
}

export async function deleteSupportTicket(id: string): Promise<{ id: string }> {
  const items = await readJSON<SupportTicket[]>('support-tickets.json', [])
  const newItems = items.filter(t => t.id !== id && t.ticketNo !== id && `#${t.id}` !== id)

  if (items.length === newItems.length) {
    throw createError({ statusCode: 404, statusMessage: 'Ticket not found' })
  }

  await writeJSON('support-tickets.json', newItems)
  return { id }
}

// ----------------- Contact Forms -----------------

export async function getContactForms(query?: { search?: string; status?: string }): Promise<ContactFormItem[]> {
  const items = await readJSON<ContactFormItem[]>('contact-forms.json', [])
  let filtered = items

  const search = (query?.search || '').toLowerCase().trim()
  const status = query?.status || ''

  if (search) {
    filtered = filtered.filter(item =>
      (item.name && item.name.toLowerCase().includes(search)) ||
      (item.email && item.email.toLowerCase().includes(search)) ||
      (item.subject && item.subject.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'all' && status !== 'All') {
    filtered = filtered.filter(item => Boolean(item.status && item.status.toLowerCase() === status.toLowerCase()))
  }

  return filtered
}

export async function createContactForm(body: any): Promise<ContactFormItem> {
  const items = await readJSON<ContactFormItem[]>('contact-forms.json', [])

  const nextId = `CNT-${5000 + items.length + 1}`
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  const date = `${dd}/${mm}/${yyyy}`

  const newContact: ContactFormItem = {
    id: nextId,
    name: body?.name || 'Anonymous',
    email: body?.email || '',
    phone: body?.phone || '',
    subject: body?.subject || 'General Inquiry',
    message: body?.message || '',
    date,
    status: 'Unread',
  }

  items.unshift(newContact)
  await writeJSON('contact-forms.json', items)
  return newContact
}

export async function deleteContactForm(id: string): Promise<{ id: string }> {
  const items = await readJSON<ContactFormItem[]>('contact-forms.json', [])
  const newItems = items.filter(c => c.id !== id)

  if (items.length === newItems.length) {
    throw createError({ statusCode: 404, statusMessage: 'Contact message not found' })
  }

  await writeJSON('contact-forms.json', newItems)
  return { id }
}

// ----------------- Cart, Checkout, Reviews, Wishlist -----------------

export async function getCarts(query?: any): Promise<{ data: CartItem[]; stats: CartStats }> {
  const items = await readJSON<CartItem[]>('carts.json', [])

  const totalCartAmount = items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0)
  const totalCartActive = items.filter(i => i.status === 'Active').length
  const totalCartCheckout = items.filter(i => i.status === 'Checkout').length
  const totalCartDelete = items.filter(i => i.status === 'Delete').length

  let filtered = [...items]

  if (query?.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(item =>
      (item.productName && item.productName.toLowerCase().includes(s)) ||
      (item.userEmail && item.userEmail.toLowerCase().includes(s)) ||
      (item.category && item.category.toLowerCase().includes(s))
    )
  }

  if (query?.category && query.category !== 'All' && query.category !== 'All Categories') {
    filtered = filtered.filter(item => item.category.toLowerCase() === String(query.category).toLowerCase())
  }

  if (query?.status && query.status !== 'All' && query.status !== 'All Status') {
    filtered = filtered.filter(item => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  if (query?.startDate && query?.endDate) {
    filtered = filtered.filter(item => isDateWithinRange(item.date, String(query.startDate), String(query.endDate)))
  }

  return {
    data: filtered,
    stats: {
      totalCartAmount,
      totalCartActive,
      totalCartCheckout,
      totalCartDelete,
    },
  }
}

export async function getCheckouts(query?: any): Promise<{ data: CheckoutItem[]; stats: CheckoutStats }> {
  const items = await readJSON<CheckoutItem[]>('checkouts.json', [])

  const totalCheckout = items.length
  const totalRevenue = items
    .filter(i => i.status === 'Berhasil')
    .reduce((sum, item) => sum + (Number(item.payment) || 0), 0)
  const totalSuccess = items.filter(i => i.status === 'Berhasil').length
  const totalFailed = items.filter(i => i.status === 'Gagal').length

  let filtered = [...items]

  if (query?.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(item =>
      (item.userEmail && item.userEmail.toLowerCase().includes(s)) ||
      (item.voucher && item.voucher.toLowerCase().includes(s)) ||
      (item.detailProduct && item.detailProduct.toLowerCase().includes(s)) ||
      (item.method && item.method.toLowerCase().includes(s))
    )
  }

  if (query?.method && query.method !== 'All' && query.method !== 'All Metode') {
    filtered = filtered.filter(item => item.method.toLowerCase() === String(query.method).toLowerCase())
  }

  if (query?.status && query.status !== 'All' && query.status !== 'All Status') {
    filtered = filtered.filter(item => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  if (query?.startDate && query?.endDate) {
    filtered = filtered.filter(item => isDateWithinRange(item.dateCheckout, String(query.startDate), String(query.endDate)))
  }

  return {
    data: filtered,
    stats: {
      totalCheckout,
      totalRevenue,
      totalSuccess,
      totalFailed,
    },
  }
}

export async function getReviews(query?: any): Promise<{ data: ReviewItem[]; stats: ReviewStats }> {
  const items = await readJSON<ReviewItem[]>('reviews.json', [])

  const totalReview = items.length
  const uniqueProducts = new Set(items.map(i => i.productId || i.productName))
  const totalProduct = uniqueProducts.size
  const totalPublish = items.filter(i => i.status === 'Publish').length

  let filtered = [...items]

  if (query?.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(item =>
      (item.userEmail && item.userEmail.toLowerCase().includes(s)) ||
      (item.productId && item.productId.toLowerCase().includes(s)) ||
      (item.productName && item.productName.toLowerCase().includes(s)) ||
      (item.title && item.title.toLowerCase().includes(s)) ||
      (item.review && item.review.toLowerCase().includes(s))
    )
  }

  if (query?.rating && query.rating !== 'All' && query.rating !== 'All Rating') {
    filtered = filtered.filter(item => String(item.rating) === String(query.rating))
  }

  if (query?.startDate && query?.endDate) {
    filtered = filtered.filter(item => isDateWithinRange(item.date, String(query.startDate), String(query.endDate)))
  }

  return {
    data: filtered,
    stats: {
      totalReview,
      totalProduct,
      totalPublish,
    },
  }
}

export async function getWishlists(query?: any): Promise<{ data: WishlistItem[]; stats: WishlistStats }> {
  const items = await readJSON<WishlistItem[]>('wishlists.json', [])

  const totalWishlistAmount = items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0)
  const totalWishlistActive = items.filter(i => i.status === 'Active').length
  const totalWishlistCheckout = items.filter(i => i.status === 'Checkout').length
  const totalWishlistDelete = items.filter(i => i.status === 'Delete').length

  let filtered = [...items]

  if (query?.search) {
    const s = String(query.search).toLowerCase().trim()
    filtered = filtered.filter(item =>
      (item.productName && item.productName.toLowerCase().includes(s)) ||
      (item.userEmail && item.userEmail.toLowerCase().includes(s)) ||
      (item.category && item.category.toLowerCase().includes(s))
    )
  }

  if (query?.category && query.category !== 'All' && query.category !== 'All Categories') {
    filtered = filtered.filter(item => item.category.toLowerCase() === String(query.category).toLowerCase())
  }

  if (query?.status && query.status !== 'All' && query.status !== 'All Status') {
    filtered = filtered.filter(item => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  if (query?.startDate && query?.endDate) {
    filtered = filtered.filter(item => isDateWithinRange(item.date, String(query.startDate), String(query.endDate)))
  }

  return {
    data: filtered,
    stats: {
      totalWishlistAmount,
      totalWishlistActive,
      totalWishlistCheckout,
      totalWishlistDelete,
    },
  }
}
