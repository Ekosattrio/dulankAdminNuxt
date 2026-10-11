import type { CartFilterQuery, CartItem, CartStats } from '../types/cart'
import type { CheckoutFilterQuery, CheckoutItem, CheckoutStats } from '../types/checkout'
import type { ContactFormFilterQuery, ContactFormItem, ContactFormStats } from '../types/contact-form'
import type { ReviewFilterQuery, ReviewItem, ReviewStats } from '../types/review'
import type { WishlistFilterQuery, WishlistItem, WishlistStats } from '../types/wishlist'
import { isDateWithinRange } from './dateRange'

function hasRange(query: { startDate?: string; endDate?: string }): query is { startDate: string; endDate: string } {
  return Boolean(query.startDate && query.endDate)
}

export async function listCarts(query: CartFilterQuery) {
  const items = await readJSON<CartItem[]>('carts.json', [])
  const stats: CartStats = {
    totalCartAmount: items.reduce((sum, item) => sum + item.totalPrice, 0),
    totalCartActive: items.filter(item => item.status === 'Active').length,
    totalCartCheckout: items.filter(item => item.status === 'Checkout').length,
    totalCartDelete: items.filter(item => item.status === 'Delete').length,
  }
  const search = query.search?.trim().toLowerCase()
  const data = items.filter((item) =>
    (!search || [item.productName, item.userEmail, item.category].some(value => value.toLowerCase().includes(search)))
    && (!query.category || query.category === 'All' || query.category === 'All Categories' || item.category.toLowerCase() === query.category.toLowerCase())
    && (!query.status || query.status === 'All' || query.status === 'All Status' || item.status.toLowerCase() === query.status.toLowerCase())
    && (!hasRange(query) || isDateWithinRange(item.date, query.startDate, query.endDate)),
  )
  return { data, stats }
}

export async function listCheckouts(query: CheckoutFilterQuery) {
  const items = await readJSON<CheckoutItem[]>('checkouts.json', [])
  const stats: CheckoutStats = {
    totalCheckout: items.length,
    totalRevenue: items.filter(item => item.status === 'Berhasil').reduce((sum, item) => sum + item.payment, 0),
    totalSuccess: items.filter(item => item.status === 'Berhasil').length,
    totalFailed: items.filter(item => item.status === 'Gagal').length,
  }
  const search = query.search?.trim().toLowerCase()
  const data = items.filter((item) =>
    (!search || [item.userEmail, item.voucher, item.detailProduct, item.method].some(value => value.toLowerCase().includes(search)))
    && (!query.method || query.method === 'All' || query.method === 'All Metode' || item.method.toLowerCase() === query.method.toLowerCase())
    && (!query.status || query.status === 'All' || query.status === 'All Status' || item.status.toLowerCase() === query.status.toLowerCase())
    && (!hasRange(query) || isDateWithinRange(item.dateCheckout, query.startDate, query.endDate)),
  )
  return { data, stats }
}

export async function listWishlists(query: WishlistFilterQuery) {
  const items = await readJSON<WishlistItem[]>('wishlists.json', [])
  const stats: WishlistStats = {
    totalWishlistAmount: items.reduce((sum, item) => sum + item.totalPrice, 0),
    totalWishlistActive: items.filter(item => item.status === 'Active').length,
    totalWishlistCheckout: items.filter(item => item.status === 'Checkout').length,
    totalWishlistDelete: items.filter(item => item.status === 'Delete').length,
  }
  const search = query.search?.trim().toLowerCase()
  const data = items.filter((item) =>
    (!search || [item.productName, item.userEmail, item.category].some(value => value.toLowerCase().includes(search)))
    && (!query.category || query.category === 'All' || query.category === 'All Categories' || item.category.toLowerCase() === query.category.toLowerCase())
    && (!query.status || query.status === 'All' || query.status === 'All Status' || item.status.toLowerCase() === query.status.toLowerCase())
    && (!hasRange(query) || isDateWithinRange(item.date, query.startDate, query.endDate)),
  )
  return { data, stats }
}

export async function listReviews(query: ReviewFilterQuery) {
  const items = await readJSON<ReviewItem[]>('reviews.json', [])
  const stats: ReviewStats = {
    totalReview: items.length,
    totalProduct: new Set(items.map(item => item.productId || item.productName)).size,
    totalPublish: items.filter(item => item.status === 'Publish').length,
  }
  const search = query.search?.trim().toLowerCase()
  const data = items.filter((item) =>
    (!search || [item.userEmail, item.productId, item.productName, item.title, item.review].some(value => value.toLowerCase().includes(search)))
    && (!query.rating || query.rating === 'All' || query.rating === 'All Rating' || String(item.rating) === String(query.rating))
    && (!hasRange(query) || isDateWithinRange(item.date, query.startDate, query.endDate)),
  )
  return { data, stats }
}

export async function listContactForms(query: ContactFormFilterQuery) {
  const items = await readJSON<ContactFormItem[]>('contact-forms.json', [])
  const stats: ContactFormStats = { totalContact: items.length }
  const search = query.search?.trim().toLowerCase()
  const data = items.filter((item) =>
    (!search || [item.name, item.email, item.phone, item.subject || '', item.message].some(value => value.toLowerCase().includes(search)))
    && (!hasRange(query) || isDateWithinRange(item.date, query.startDate, query.endDate)),
  )
  return { data, stats }
}
