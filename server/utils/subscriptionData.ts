import type { SubscriptionItem, SubscriptionStats } from '../types/subscription'

const SUBSCRIPTION_FILE = 'subscriptions.json'

export async function getSubscriptions(): Promise<SubscriptionItem[]> {
  const data = await readJSON<SubscriptionItem[]>(SUBSCRIPTION_FILE)
  return Array.isArray(data) ? data : []
}

export async function getSubscriptionStats(): Promise<SubscriptionStats> {
  const items = await getSubscriptions()
  const totalSubscribers = items.length
  let activeSubscribers = 0
  let expiredSubscribers = 0

  for (const item of items) {
    if (item.status === 'Paid') {
      activeSubscribers++
    } else {
      expiredSubscribers++
    }
  }

  return {
    totalTransactions: 307000,
    totalSubscribers,
    activeSubscribers,
    expiredSubscribers
  }
}

export async function saveSubscription(item: Partial<SubscriptionItem> & { subscriber: string }): Promise<SubscriptionItem> {
  const items = await getSubscriptions()
  if (item.id) {
    const idx = items.findIndex((s) => s.id === item.id)
    if (idx !== -1) {
      const existing = items[idx]
      if (!existing) throw createError({ statusCode: 404, statusMessage: 'Subscription not found' })
      const updated: SubscriptionItem = {
        ...existing,
        ...item
      }
      items[idx] = updated
      await writeJSON(SUBSCRIPTION_FILE, items)
      return updated
    }
  }

  const nextId = items.length > 0 ? Math.max(...items.map((s) => s.id)) + 1 : 1
  const newSub: SubscriptionItem = {
    id: nextId,
    subscriber: item.subscriber,
    plan: item.plan || 'Basic (Monthly)',
    billingCycle: item.billingCycle || '30 Days',
    method: item.method || 'Credit Card',
    amount: item.amount || 0,
    createdDate: item.createdDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    expiringOn: item.expiringOn || new Date(Date.now() + 30 * 24 * 3600 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: item.status || 'Paid'
  }

  items.unshift(newSub)
  await writeJSON(SUBSCRIPTION_FILE, items)
  return newSub
}

export async function deleteSubscription(id: number): Promise<boolean> {
  const items = await getSubscriptions()
  const filtered = items.filter((s) => s.id !== id)
  if (filtered.length === items.length) {
    throw createError({ statusCode: 404, statusMessage: 'Subscription not found' })
  }
  await writeJSON(SUBSCRIPTION_FILE, filtered)
  return true
}

