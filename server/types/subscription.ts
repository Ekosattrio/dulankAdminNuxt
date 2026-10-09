export interface SubscriptionItem {
  id: number
  subscriber: string
  plan: string
  billingCycle: string
  method: string
  amount: number
  createdDate: string
  expiringOn: string
  status: 'Paid' | 'Unpaid'
}

export interface SubscriptionStats {
  totalTransactions: number
  totalSubscribers: number
  activeSubscribers: number
  expiredSubscribers: number
}

